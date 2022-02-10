import { config } from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import { SubscriptionClient } from '@azure/arm-resources-subscriptions';
import { OperationalInsightsManagementClient } from '@azure/arm-operationalinsights';
import fetch from 'node-fetch';
import axios from 'axios';
config();

// Create a new credential.
const credential = new DefaultAzureCredential();

const sdkController = {};

// If only getting execution counts for Function Applications, set the executionOnly property to true.
sdkController.executionOnly = async (req, res, next) => {
  res.locals.executionOnly = true;
  return next();
};

// Get all subscriptions associated with the given credential.
sdkController.fetchSubscriptionIds = async (req, res, next) => {
  const subClient = new SubscriptionClient(credential);
  const subscriptions = subClient.subscriptions.list();

  res.locals.subscriptions = {};
  for await (const sub of subscriptions) {
    res.locals.subscriptions[sub.subscriptionId] = {
      tenantId: sub.tenantId,
      displayName: sub.displayName,
      id: sub.id,
      subscriptionId: sub.subscriptionId,
      subscriptionName: sub.subscriptionName,
      resourceGroups: {},
    };

    // Create an insights management client for collecting workspace IDs (for insights into function-level metrics).
    const opClient = new OperationalInsightsManagementClient(credential, res.locals.subscriptions[sub.subscriptionId].subscriptionId);
    let workspaces = await opClient.workspaces.list();
    res.locals.subscriptions[sub.subscriptionId].workSpaceArray = [];
    for await (const workspace of workspaces) {
      res.locals.subscriptions[sub.subscriptionId].workSpaceArray.push(workspace.customerId);
    }
  }
  return next();
};

// Get all resource groups associated with the given subscription.
sdkController.fetchResourceGroups = async (req, res, next) => {
  for (let sub in res.locals.subscriptions) {
    res.locals.subscriptions[sub].rmc = new ResourceManagementClient(credential, sub);
    const groups = res.locals.subscriptions[sub].rmc.resourceGroups.list({ top: null });
    const groupsByPage = groups.byPage();
    const groupsPerSub = await groupsByPage.next();
    const opClient = new OperationalInsightsManagementClient(credential, res.locals.subscriptions[sub].subscriptionId);
    let workspaces = await opClient.workspaces.list();
    await workspaces.next();
    res.locals.subscriptions[sub].resourceGroups = groupsPerSub.value;
  }
  return next();
};

// Get all resources associated with the given resource group.
sdkController.fetchResources = async (req, res, next) => {
  const functionAppArray = [];
  const insightsList = [];
  const subscriptions = res.locals.subscriptions;
  for (let sub in subscriptions) {
    const currentSub = subscriptions[sub];
    for (let group in currentSub.resourceGroups) {
      const currentGroup = currentSub.resourceGroups[group];

      // Add a resource management client, and store it on the currentSub object on res.locals.
      const rmc = currentSub.rmc;

      // List resources.
      const resources = rmc.resources.listByResourceGroup(currentGroup.name);

      const functionList = [];

      // Sort resources into Function Applications and Insights. Ignore others.
      for await (const app of resources) {
        app.tenantId = currentSub.tenantId;
        app.subscriptionDisplayName = currentSub.displayName;
        app.subscriptionNamespaceId = currentSub.id;
        app.subscriptionId = currentSub.subscriptionId;
        app.resourceGroupId = currentGroup.id;
        app.resourceGroupName = currentSub.resourceGroups[group].name;
        if ((app.kind === 'functionapp' || app.kind === 'functionapp,linux') && (app.type === 'Microsoft.Web/sites' || app.type === 'microsoft.web/sites')) {
          // If type is 'function', sort it into an array of function apps.
          functionList.push(app);
        } else if (app.type.toLowerCase() === 'microsoft.insights/components') {
          insightsList.push(app);
        }
      }

      // Pair every insight component with its corresponding function application.
      insightsList.forEach((app) => {
        for (const functionApp of functionList) {
          // Convert both to lowercase to avoid capitalization inconsistencies that appear in results retrieved through SDK.
          const fatl = functionApp.name.toLowerCase();
          const atl = app.name.toLowerCase();
          if (fatl === atl) {
            functionApp.insightId = app.id;
          }
        }
      });
      // That group's function list is equal to the modified functionList.
      currentGroup.functionList = functionList;
      functionList.forEach((app) => {
        functionAppArray.push(app);
      });
    }
  }

  // Delete the RMC once it's no longer needed, so that circular reference issues are avoided when JSONifying the object.
  for (const sub in res.locals.subscriptions) {
    delete res.locals.subscriptions[sub].rmc;
  }

  res.locals.functionApps = functionAppArray;
  res.locals.insights = insightsList;

  return next();
};

// Format the object of execution counts before it goes back to the client.
sdkController.formatExecutions = (req, res, next) => {
  const executionObj = {};

  // Iterate through subscriptions.
  for (let sub in res.locals.subscriptions) {
    executionObj[sub] = {};

    // Iterate through resource groups.
    for (let group of res.locals.subscriptions[sub].resourceGroups) {
      if (group.functionList.length) {
        executionObj[sub][group.name] = {};
        let currentFuncArray = group.functionList;

        // Iterate through resources (function apps).
        currentFuncArray.forEach((func) => {
          let functionCount = {
            name: func.name,
            id: func.id,
            tenantId: func.tenantId,
            subscriptionDisplayName: func.subscriptionDisplayName,
            subscriptionId: func.subscriptionId,
            subscriptionNamespaceId: func.subscriptionNamespaceId,
            resourceGroupId: func.resourceGroupId,
            resourceGroupName: func.resourceGroupName,
            location: func.location,
            metricName: 'ExecutionCount',
            timeseries: res.locals.webMetrics[func.name].metrics[0].timeseries,
          };

          // Set insightId identifier for tracking metrics available only through Insights providers.
          if (func.insightId !== undefined) {
            functionCount.insightId = func.insightId;
          }
          if (res.locals.subscriptions[sub].workSpaceArray[0] !== undefined) {
            functionCount.workSpaceId = res.locals.subscriptions[sub].workSpaceArray[0];
          } else {
          }
          functionCount.totalCount = 0;
          functionCount.timeseries.forEach((time) => {
            functionCount.totalCount += time.total;
          });
          executionObj[sub][group.name][functionCount.name] = functionCount;
        });
      }
    }
  }

  res.locals.executionObj = executionObj;
  return next();
};

// Get all functions associated with a particular function app.
sdkController.getAllFunctions = async (req, res, next) => {
  const { subscriptionIdentifier, resourceGroupName, appName } = res.locals.azure.functionData;
  try {
    const fetchURL = `https://management.azure.com/subscriptions/${subscriptionIdentifier}/resourceGroups/${resourceGroupName}/providers/Microsoft.Web/sites/${appName}/functions?api-version=2021-01-01`;
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + res.locals.azure.bearerToken.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.locals.allFunctions = data;
        return next();
      });
  } catch (err) {
    return next(err);
  }
};

// Get all functions associated with all resource groups and subscribers. Data is reflected from frontend after it receives the execution-count object.
sdkController.getFunctionList = async (req, res, next) => {
  res.locals.funcList = {
    functions: [],
  };
  const funcPromise = [];
  const funcSub = [];
  const funcResGrp = [];
  const funcRes = [];

  // Iterate through each subscriber.
  for (let sub in res.locals.azure.subList) {
    let currentSub = res.locals.azure.subList[sub];

    // Iterate through resource groups.
    for (let resGroup in currentSub) {
      let currentGrp = currentSub[resGroup];

      // Iterate through resources.
      for (let resource = 0; resource < currentGrp.length; resource++) {
        let currentRes = currentGrp[resource];
        const fetchURL = `https://management.azure.com/subscriptions/${sub}/resourceGroups/${resGroup}/providers/Microsoft.Web/sites/${currentRes}/functions?api-version=2021-01-01`;
        let fetchPromise = axios(fetchURL, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + res.locals.azure.bearerToken.token,
          },
        });
        funcPromise.push(fetchPromise);
        funcSub.push(sub);
        funcResGrp.push(resGroup);
        funcRes.push(currentRes);
      }
    }
  }
  Promise.all(funcPromise).then((resultArray) => {
    // Iterate through each requested resource in the promise array.
    for (let i = 0; i < resultArray.length; i++) {
      let currentFuncAppData = resultArray[i].data.value;

      // Iterate through each function within each requested resource.
      for (let j = 0; j < currentFuncAppData.length; j++) {
        let currentFuncData = currentFuncAppData[j];
        let currentSub = funcSub[i];
        let currentGrp = funcResGrp[i];
        let currentRes = funcRes[i];
        const currentFunc = {
          shortname: currentFuncData.properties.name,
          id: currentFuncData.id,
          fullname: currentFuncData.name,
          type: currentFuncData.type,
          location: currentFuncData.location,
          properties: currentFuncData.properties,
          subscription: currentSub.subName,
          resourceGroup: currentGrp.resourceGroupName,
          resource: currentRes,
        };
        res.locals.funcList.functions.push(currentFunc);
      }
    }

    return next();
  });
};

// Retrieve subscriber list sent from frontend.
sdkController.setSub = (req, res, next) => {
  res.locals.azure.subList = req.body;
  return next();
};

// When sending back more specific data about a function application, format it to object expected by frontend.
sdkController.formatAppDetail = (req, res, next) => {
  const selectedApp = res.locals.functionApps[0];
  const metricsArray = res.locals.webMetrics[selectedApp.name].metrics;
  const insightsArray = res.locals.insightsMetrics[0].metrics;

  // Push insights to the metrics array.
  insightsArray.forEach((insight) => {
    metricsArray.push(insight);
  });

  // Format functionApp detail object.
  res.locals.appDetail = {
    name: selectedApp.name,
    id: selectedApp.id,
    resourceGroupId: selectedApp.resourceGroupId,
    resourceGroupName: selectedApp.resourceGroupName,
    location: selectedApp.location,
    metrics: metricsArray,
  };

  return next();
};

// Format data from frontend, timespan, and granularity into format accessible to backend.
sdkController.setFunctionApp = (req, res, next) => {
  // Both single-function and multi-function routes should be relying on same data in res.locals.
  const { name, id, location, insightId, resourceGroupId, resourceGroupName, workSpaceId, granularity, timespan } = req.body;
  res.locals.functionApps = [];
  res.locals.functionApps.push({
    name: name,
    id: id,
    resourceGroupId: resourceGroupId,
    resourceGroupName: resourceGroupName,
    location: location,
    insightId: insightId,
    workSpaceId: workSpaceId,
    timespan: timespan,
    granularity: granularity,
  });
  res.locals.executionOnly = false;

  // If timeframe is set, translate timeframe to ISO8601 format expected by Azure SDK.
  switch (timespan) {
    case 0:
      res.locals.timespan = 'PT1H';
      break;
    case 1:
      res.locals.timespan = 'PT24H';
      break;
    case 2:
      res.locals.timespan = 'PT48H';
      break;
    case 3:
      res.locals.timespan = 'P7D';
      break;
    case 4:
      res.locals.timespan = 'P1M';
      break;
    default:
      res.locals.timespan = 'PT24H';
      break;
  }

  // If granularity is set, translate granularity to ISO8601 format expected by Azure SDK.
  switch (granularity) {
    case 0:
      res.locals.granularity = 'PT5M';
      break;
    case 1:
      res.locals.granularity = 'PT15M';
      break;
    case 2:
      res.locals.granularity = 'PT30M';
      break;
    case 3:
      res.locals.granularity = 'PT1H';
      break;
    case 4:
      res.locals.granularity = 'PT6H';
      break;
    case 5:
      res.locals.granularity = 'PT12H';
      break;
    case 6:
      res.locals.granularity = 'P1D';
      break;
    default:
      res.locals.granularity = 'PT1H';
      break;
  }
  return next();
};

// Transform data from frontend seeking metrics for a specific function.
sdkController.setFunction = (req, res, next) => {
  let { workSpaceId, functionName, timespan, granularity } = req.body;

  // Convert timespans to ISO8601 format. For now, this is the same timespan convert as is used for function applications.
  switch (timespan) {
    case 0:
      timespan = 'PT1H';
      break;
    case 1:
      timespan = 'PT24H';
      break;
    case 2:
      timespan = 'PT48H';
      break;
    case 3:
      timespan = 'P7D';
      break;
    case 4:
      timespan = 'P1M';
      break;
    default:
      timespan = 'PT24H';
      break;
  }

  // Convert granularity signifier from frontend to format expected by table-processing function for Azure logs.
  // 0 = 5 minutes, 1 = 15 minutes, 2 = 30 minutes, 3 = 60 minutes, 4 = 6 hours, 5 = 12 hours, 6 = 24 hours.

  switch (granularity) {
    case 0:
      granularity = 5;
      break;
    case 1:
      granularity = 15;
      break;
    case 2:
      granularity = 30;
      break;
    case 3:
      granularity = 60;
      break;
    case 4:
      granularity = 360;
      break;
    case 5:
      granularity = 720;
      break;
    case 6:
      granularity = 1440;
      break;
    default:
      granularity = 60;
      break;
  }

  // Add formatted request for function data to res.locals.
  res.locals.azure = {
    specificFunction: {
      azureLogAnalyticsWorkspaceId: workSpaceId,
      functionName: functionName,
      timespan: timespan,
      granularity: granularity,
    },
  };
  return next();
};

// Format selection of a specific resource (function application).
sdkController.setResource = (req, res, next) => {
  const { subscription, resourceGroupName, appName } = req.body;
  res.locals.azure = {
    functionData: {
      subscriptionIdentifier: subscription,
      resourceGroupName: resourceGroupName,
      appName: appName,
    },
  };
  return next();
};

export default sdkController;
