import { config } from 'dotenv';
// import { MSWebSimulator, MSStorageSimulator, MSInsightsSimulator } from '../constants/frontendSimulator.js';
import { /*InteractiveBrowserCredential,*/ DefaultAzureCredential /*, AzureCliCredential, ChainedTokenCredential*/ } from '@azure/identity';
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
  const start = new Date();
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
  for await (const sub of subscriptions){
    res.locals.subscriptions[sub.subscriptionId] = {
      tenantId: sub.tenantId,
      displayName: sub.displayName,
      id: sub.id,
      subscriptionId: sub.subscriptionId,
      subscriptionName: sub.subscriptionName,
      resourceGroups: {},
    };
  };
  // this would make res.locals.subscriptionData an array.
  // instead, let's make res.locals.subscriptionData an object.
  // each property on the object will be a subscription.
  // each subscritpion will in turn contain a resource group.
  // each resource group property will in turn contain a list of resources.
  // each resource will in turn contain a list of function applications.
  console.log('fetch subscriptions took');
  const end = new Date();
  console.log(end - start);
  console.log('milliseconds');
  return next();
};

// sdkController.fetchSubscriptionIdsOld = async (req, res, next) => {
//   // get all subscriptions associated with the given credential.
//   // look up iterator functionality in relation to promise use.
//   // subscriptions are accessed through an iterator.
//   // may need to iterate through pages of subscriptions.
//   const subClient = new SubscriptionClient(credential);
//   const subscriptions = subClient.subscriptions.list().byPage();
//   const nextSub = await subscriptions.next();
//   // nextSub.value will return an array of subscriptions.
//   // for our purposes, all we need is the subscriptionId.
//   // return an array of subscription ids.
//   res.locals.subscriptions = {};
//   //This is using .list().byPage() await .next().value because we are using a forEach loop.
//   //If we iterate with a for loop, we can use await .list() and for await ().
//   nextSub.value.forEach((sub) => {
//     res.locals.subscriptions[sub.subscriptionId] = {
//       tenantId: sub.tenantId,
//       displayName: sub.displayName,
//       id: sub.id,
//       subscriptionId: sub.subscriptionId,
//       subscriptionName: sub.subscriptionName,
//       resourceGroups: {},
//     };
//   });
//   return next();
// };

// Discuss whether this is the best way to handle.
sdkController.fetchResourceGroups = async (req, res, next) => {
  const start = new Date();
  for (let sub in res.locals.subscriptions) {
    res.locals.subscriptions[sub].rmc = new ResourceManagementClient(credential, sub);
    const groups = res.locals.subscriptions[sub].rmc.resourceGroups.list({ top: null });
    const groupsByPage = groups.byPage();
    const groupsPerSub = await groupsByPage.next();
    //Because we aren't iterating we need to use the .next() property.
    res.locals.subscriptions[sub].resourceGroups = groupsPerSub.value;
  }
  const end = new Date();
  console.log('fetching resource groups took');
  console.log(end - start);
  console.log('milliseconds');
  return next();
};

sdkController.fetchResources = async (req, res, next) => {
  const start = new Date();
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
      for await (const app of resources){
        app.tenantId = currentSub.tenantId;
        app.subscriptionDisplayName = currentSub.displayName;
        app.subscriptionNamespaceId = currentSub.id;
        app.subscriptionId = currentSub.subscriptionId;
        app.resourceGroupId = currentGroup.id;
        app.resourceGroupName = currentSub.name;
        if ((app.kind === 'functionapp' || app.kind === 'functionapp,linux') && (app.type === 'Microsoft.Web/sites' || app.type === 'microsoft.web/sites')) {
          // If type is 'function', sort it into an array of function apps.
          functionList.push(app);
        } else if (app.type.toLowerCase() === 'microsoft.insights/components') {
          insightsList.push(app);
        }
      };

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
  const end = new Date();
  console.log('fetching resources took')
  console.log(end - start);
  console.log('milliseconds');
  return next();
};

sdkController.formatExecutions = (req, res, next) => {
  const startTime = new Date();
  const executionObj = {};
  for (let sub in res.locals.subscriptions) {
    executionObj[sub] = {};
    for (let group of res.locals.subscriptions[sub].resourceGroups) {
      if (group.functionList.length) {
        //console.log(executionObj[sub]);
        executionObj[sub][group.name] = {};
        let currentFuncArray = group.functionList;
        console.log('res.locals.webMetrics');
        console.log(res.locals.webMetrics);
        console.log(currentFuncArray);
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
            timeseries: res.locals.webMetrics[func.name].metrics[0].timeseries
          };
          if (func.insightId !== undefined) {
            functionCount.insightId = func.insightId;
          }
          functionCount.totalCount = 0;
          console.log('functioncount timeseries');
          console.log(functionCount);
          functionCount.timeseries.forEach((time) => {
            functionCount.totalCount += time.total;
          });
          executionObj[sub][group.name][functionCount.name] = functionCount;
        });
      }
    }
  }
  res.locals.executionObj = executionObj;

  const endTime = new Date();
  console.log('formatting executions took');
  console.log(endTime - startTime);
  console.log('milliseconds');
  return next();
};

sdkController.formatAppDetail = (req, res, next) => {
  const start = new Date();
  const selectedApp = res.locals.functionApps[0];
  const metricsArray = res.locals.webMetrics[selectedApp.name].metrics;
  const insightsArray = res.locals.insightsMetrics[0].metrics;
  const metricsObj = {};
  console.log('metricsArray');
  console.log(metricsArray);
  //metricsArray.forEach((metric) => {
  //  metricsObj[metric.name] = metric;
  //});
  console.log('insightsArray');
  console.log(insightsArray);
  //insightsArray.forEach((insight) => {
  //  metricsObj[insight.name] = insight;
  //});
  insightsArray.forEach((insight) => {
    metricsArray.push(insight)
  })
  res.locals.appDetail = {
    name: selectedApp.name,
    id: selectedApp.id,
    resourceGroupId: selectedApp.resourceGroupId,
    resourceGroupName: selectedApp.resourceGroupName,
    location: selectedApp.location,
    metrics: metricsArray,
  };
  // metrics: metricsObj;
  const end = new Date();
  console.log('formatting App Detail took');
  console.log(end - start);
  console.log('milliseconds');
  return next();
};

sdkController.setFunctionApp = (req, res, next) => {
  const start = new Date();
  // Both single-function and multi-function routes should be relying on same data in res.locals.
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
  const end = new Date();
  console.log('setting function application export details took');
  console.log(end - start);
  console.log('milliseconds');
  return next();
};

export default sdkController;
