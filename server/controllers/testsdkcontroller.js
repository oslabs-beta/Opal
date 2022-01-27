import { config } from 'dotenv';
// No longer need simulators for now.
import { MSWebSimulator, MSStorageSimulator, MSInsightsSimulator } from '../constants/frontendSimulator.js';
// Could possibly dispense with other identities.
import { InteractiveBrowserCredential, DefaultAzureCredential, AzureCliCredential, ChainedTokenCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import { SubscriptionClient } from '@azure/arm-resources-subscriptions';
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
  const subscriptions = subClient.subscriptions.list().byPage();
  const nextSub = await subscriptions.next();
  console.log('NEXTSUB');
  console.log(nextSub);
  // nextSub.value will return an array of subscriptions.
  // for our purposes, all we need is the subscriptionId.
  // return an array of subscription ids.
  res.locals.subscriptions = {};
  nextSub.value.forEach((sub) => {
    console.log('ALL SUB DATA');
    console.log(res.locals.subscriptions[sub]);
    res.locals.subscriptions[sub.subscriptionId] = {
      tenantId: sub.tenantId,
      displayName: sub.displayName,
      id: sub.id,
      subscriptionId: sub.subscriptionId,
      subscriptionName: sub.subscriptionName,
      resourceGroups: {},
    };
  });
  // this would make res.locals.subscriptionData an array.
  // instead, let's make res.locals.subscriptionData an object.
  // each property on the object will be a subscription.
  // each subscritpion will in turn contain a resource group.
  // each resource group property will in turn contain a list of resources.
  // each resource will in turn contain a list of function applications.
  return next();
};

// Discuss whether this is the best way to handle.
sdkController.fetchResourceGroups = async (req, res, next) => {
  for (let id in res.locals.subscriptions) {
    res.locals.subscriptions[id].rmc = new ResourceManagementClient(credential, id);
    const groups = res.locals.subscriptions[id].rmc.resourceGroups.list({ top: null });
    const groupsByPage = groups.byPage();
    const groupsPerSub = await groupsByPage.next();
    res.locals.subscriptions[id].resourceGroups = groupsPerSub.value;
  }
  return next();
};

sdkController.fetchResources = async (req, res, next) => {
  const functionAppArray = [];
  const insightsList = [];
  // for every resource group.
  // NOTE: cannot use foreach with async-await.
  for (let id in res.locals.subscriptions) {
    // resource groups are presented as arrays
    for (let group in res.locals.subscriptions[id].resourceGroups) {
      // add resource management client for this specific resource group.
      const rmc = res.locals.subscriptions[id].rmc;
      // get list of resources associated with that group.
      const resources = await rmc.resources.listByResourceGroup(res.locals.subscriptions[id].resourceGroups[group].name);
      const resourcesByPage = resources.byPage();
      // assume only one page
      // get list of all resources in a given group.
      const allResources = await resourcesByPage.next();
      const functionList = [];

      // for each resource in a given group
      await allResources.value.forEach((app) => {
        console.log('value of current group');
        console.log(res.locals.subscriptions[id].resourceGroups[group].id);
        console.log(res.locals.subscriptions[id].resourceGroups[group].name);
        app.tenantId = res.locals.subscriptions[id].tenantId;
        app.subscriptionDisplayName = res.locals.subscriptions[id].displayName;
        app.subscriptionNamespaceId = res.locals.subscriptions[id].id;
        app.subscriptionId = res.locals.subscriptions[id].subscriptionId;
        app.resourceGroupId = res.locals.subscriptions[id].resourceGroups[group].id;
        app.resourceGroupName = res.locals.subscriptions[id].resourceGroups[group].name;
        if ((app.kind === 'functionapp' || app.kind === 'functionapp,linux') && (app.type === 'Microsoft.Web/sites' || app.type === 'microsoft.web/sites')) {
          functionList.push(app);
        }
      });

      await allResources.value.forEach((app) => {
        if (app.type.toLowerCase() === 'microsoft.insights/components') {
          for (const functionApp of functionList) {
            const fatl = functionApp.name.toLowerCase();
            const atl = app.name.toLowerCase();
            if (fatl === atl) {
              insightsList.push(app);
              functionApp.insightId = app.id;
            }
          }
        }
      });
      res.locals.subscriptions[id].resourceGroups[group].functionList = functionList;
    }
  }
  for (const sub in res.locals.subscriptions) {
    for (const resourceGroup in res.locals.subscriptions[sub].resourceGroups) {
      for (const functionApp in res.locals.subscriptions[sub].resourceGroups[resourceGroup].functionList) {
        let currentApp = res.locals.subscriptions[sub].resourceGroups[resourceGroup].functionList[functionApp];
        functionAppArray.push(currentApp);
      }
    }
  }

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
    console.log('getting into the subscriptions loop');
    executionObj[sub] = {};
    //executionObj[sub].resourceGroups = {};
    for (let group of res.locals.subscriptions[sub].resourceGroups) {
      // //executionObj[sub].resourceGroups[group.name] = {};
      if (group.functionList.length) {
        console.log(executionObj[sub]);
        executionObj[sub][group.name] = {};
        let currentFuncArray = group.functionList;
        // executionObj[sub].resourceGroups[group.name]
        currentFuncArray.forEach((func) => {
          // Why is insightId not being set for every function application?
          // Do some not have insights ids, or are we not setting it properly?
          console.log('got to first set of function count');
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
            timeseries: res.locals.webMetrics[func.name].metrics[0].timeseries[0].data,
          };
          if (func.insightId !== undefined) {
            functionCount.insightId = func.insightId;
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

sdkController.formatAppDetail = (req, res, next) => {
  const selectedApp = res.locals.functionApps[0];
  console.log('selectedApp');
  console.log(selectedApp);
  const metricsArray = res.locals.webMetrics[selectedApp.name].metrics;
  const insightsArray = res.locals.insightsMetrics[0].metrics;
  const metricsObj = {};
  metricsArray.forEach((metric) => {
    metricsObj[metric.name] = metric;
  });
  insightsArray.forEach((insight) => {
    metricsObj[insight.name] = insight;
  });
  res.locals.appDetail = {
    name: selectedApp.name,
    id: selectedApp.id,
    resourceGroupId: selectedApp.resourceGroupId,
    resourceGroupName: selectedApp.resourceGroupName,
    location: selectedApp.location,
    metrics: metricsObj,
  };
  return next();
};

sdkController.setFunctionApp = (req, res, next) => {
  const { name, id, location, insightId, resourceGroupId, resourceGroupName } = req.body;
  res.locals.functionApps = [];
  res.locals.functionApps.push({
    name: name,
    id: id,
    resourceGroupId: resourceGroupId,
    resourceGroupName: resourceGroupName,
    location: location,
    insightId: insightId,
  });
  res.locals.executionOnly = false;
  // For both routes to use identical data, we would also want this to include the following properties.
  // type: (e.g., Microsoft.Web/sites') and kind: (e.g., 'functionapp').
  return next();
};

export default sdkController;
