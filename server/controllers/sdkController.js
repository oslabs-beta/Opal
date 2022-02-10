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

sdkController.executionOnly = async (req, res, next) => {
  res.locals.executionOnly = true;
  return next();
};

sdkController.fetchSubscriptionIds = async (req, res, next) => {
  // get all subscriptions associated with the given credential.
  // look up iterator functionality in relation to promise use.
  // subscriptions are accessed through an iterator.
  // may need to iterate through pages of subscriptions.
  const subClient = new SubscriptionClient(credential);
  const subscriptions = subClient.subscriptions.list();
  // const nextSub = await subscriptions.next();
  // nextSub.value will return an array of subscriptions.
  // for our purposes, all we need is the subscriptionId.
  // return an array of subscription ids.

  res.locals.subscriptions = {};
  //This is using .list().byPage() await .next().value because we are using a forEach loop.
  //If we iterate with a for loop, we can use await .list() and for await ().
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
      console.log(workspace);
      res.locals.subscriptions[sub.subscriptionId].workSpaceArray.push(workspace.customerId);
      console.log('workSpaceArray');
      console.log(res.locals.subscriptions[sub.subscriptionId].workSpaceArray);
    }


  }
  return next();
};

sdkController.fetchResourceGroups = async (req, res, next) => {
  for (let sub in res.locals.subscriptions) {
    res.locals.subscriptions[sub].rmc = new ResourceManagementClient(credential, sub);
    const groups = res.locals.subscriptions[sub].rmc.resourceGroups.list({ top: null });
    const groupsByPage = groups.byPage();
    const groupsPerSub = await groupsByPage.next();
    //Because we aren't iterating we need to use the .next() property.
    const opClient = new OperationalInsightsManagementClient(credential, res.locals.subscriptions[sub].subscriptionId);
    console.log('groupsPerSub is');
    console.log(groupsPerSub.value);
    let workspaces = await opClient.workspaces.list();
    console.log('WORK SPACE');
    const awaited = await workspaces.next();
    console.log(awaited);

    res.locals.subscriptions[sub].resourceGroups = groupsPerSub.value;
  }
  return next();
};

sdkController.fetchResources = async (req, res, next) => {
  const functionAppArray = [];
  const insightsList = [];
  const subscriptions = res.locals.subscriptions;
  for (let sub in subscriptions) {
    const currentSub = subscriptions[sub];
    for (let group in currentSub.resourceGroups) {
      const currentGroup = currentSub.resourceGroups[group];
      // add resource management client for this specific resource group.
      const rmc = currentSub.rmc;
      // get list of resources associated with that group.
      const resources = rmc.resources.listByResourceGroup(currentGroup.name);
      // const resourcesByPage = resources.byPage();
      // assume only one page
      // get list of all resources in a given group.
      // const allResources = await resourcesByPage.next();
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
          // Convert both to lowercase to avoid capitalization issues.
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

  // delete the RMC once it's no longer needed.
  for (const sub in res.locals.subscriptions) {
    delete res.locals.subscriptions[sub].rmc;
  }

  res.locals.functionApps = functionAppArray;
  res.locals.insights = insightsList;
  return next();
};

sdkController.formatExecutions = (req, res, next) => {
  const executionObj = {};
  for (let sub in res.locals.subscriptions) {
    executionObj[sub] = {};
    for (let group of res.locals.subscriptions[sub].resourceGroups) {
      if (group.functionList.length) {
        executionObj[sub][group.name] = {};
        let currentFuncArray = group.functionList;
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
          if (func.insightId !== undefined) {
            functionCount.insightId = func.insightId;
          }
          if (res.locals.subscriptions[sub].workSpaceArray[0] !== undefined) {
            //console.log(res.locals.subscriptions[sub]);
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

// This should be renamed -- this just gets all functions associated with one function app.
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
    console.log('ERROR in web data');
    return next(err);
  }
};

// This route gets all functions associated with all subscribers and resource groups fed in from frontend.
// Like need this to be async, but confirm.
sdkController.getFunctionList = async (req, res, next) => {
  res.locals.funcList = {
    functions: [],
  };
  const funcPromise = [];
  const funcSub = [];
  const funcResGrp = [];
  const funcRes = [];
  for (let sub in res.locals.azure.subList) {
    let currentSub = res.locals.azure.subList[sub];
    for (let resGroup in currentSub) {
      let currentGrp = currentSub[resGroup];
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
    // For each requested resource in the promise array.
    for (let i = 0; i < resultArray.length; i++) {
      let currentFuncAppData = resultArray[i].data.value;
      // For each function within each requested resource.
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

sdkController.setSub = (req, res, next) => {
  res.locals.azure.subList = req.body;
  return next();
};

sdkController.formatAppDetail = (req, res, next) => {
  const selectedApp = res.locals.functionApps[0];
  const metricsArray = res.locals.webMetrics[selectedApp.name].metrics;
  const insightsArray = res.locals.insightsMetrics[0].metrics;
  const metricsObj = {};
  insightsArray.forEach((insight) => {
    metricsArray.push(insight);
  });
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

  // If timeframe is set, translate timeframe to data usable by sdkController.
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

sdkController.setFunction = (req, res, next) => {
  console.log('entering setFunction');
  console.log(req.body);
  const { workSpaceId, functionName } = req.body;
  res.locals.azure = {
    specificFunction: {
      azureLogAnalyticsWorkspaceId: workSpaceId,
      functionName: functionName,
    },
  };
  return next();
};

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
