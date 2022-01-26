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

  // nextSub.value will return an array of subscriptions.
  // for our purposes, all we need is the subscriptionId.
  // return an array of subscription ids.
  res.locals.subscriptions = {};
  nextSub.value.forEach((sub) => {
    res.locals.subscriptions[sub.subscriptionId] = {
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
  // console.log('THIS IS ALL OF THE RESOURCE GROUPS');
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
      const rmc = res.locals.subscriptions[id].rmc;
      const resources = await rmc.resources.listByResourceGroup(res.locals.subscriptions[id].resourceGroups[group].name);
      const resourcesByPage = resources.byPage();
      // assume only one page
      const allResources = await resourcesByPage.next();
      const functionList = [];

      await allResources.value.forEach((app) => {
        if ((app.kind === 'functionapp' || app.kind === 'functionapp,linux') && app.type === 'Microsoft.Web/sites') {
          functionList.push(app);
        }
      });

      // console.log('allResources.value', allResources.value);
      // console.log('functionList', functionList);

      await allResources.value.forEach((app) => {
        // console.log('forEach loop for insights');
        if (app.type === 'Microsoft.Insights/components') {
          for (const functionApp of functionList) {
            console.log('functionApp', functionApp);
            console.log('app', app);
            if (functionApp.name === app.name) insightsList.push(app);
          }
        }
      });

      res.locals.subscriptions[id].resourceGroups[group].functionList = functionList;
    }
  }
  //  console.log('subscriptions');
  for (const sub in res.locals.subscriptions) {
    for (const resourceGroup in res.locals.subscriptions[sub].resourceGroups) {
      // console.log('contents of current resource group');
      // console.log(res.locals.subscriptions[sub].resourceGroups[resourceGroup]);
      for (const functionApp in res.locals.subscriptions[sub].resourceGroups[resourceGroup].functionList) {
        let currentApp = res.locals.subscriptions[sub].resourceGroups[resourceGroup].functionList[functionApp];
        //let currentApp = res.locals.subscriptions[sub].resourceGroups[resourceGroup];
        // console.log(currentApp);
        functionAppArray.push(currentApp);
      }
    }
  }
  // console.log('subscriptions');
  // console.log(res.locals.subscriptions);

  for (const sub in res.locals.subscriptions) {
    delete res.locals.subscriptions[sub].rmc;
  }

  // console.log('insightsList', insightsList);
  res.locals.functionApps = functionAppArray;
  res.locals.insights = insightsList;

  // console.log('subscriptions');
  return next();
};

sdkController.formatExecutions = (req, res, next) => {
  //console.log('SUBSCRIPTIONS OBJECT');
  //console.log(res.locals.subscriptions['eb87b3ba-9c9c-4950-aa5d-6e60e18877ad']);
  const executionObj = {};
  for (let sub in res.locals.subscriptions) {
    // console.log('here is what is in res.locals.subscriptions');
    // console.log(res.locals.subscriptions);
    // console.log('here is what this sub is');
    // console.log(sub);
    executionObj[sub] = {};
    console.log('res.locals.subscriptions[sub].resourceGroups', res.locals.subscriptions[sub].resourceGroups);
    for (let group of res.locals.subscriptions[sub].resourceGroups) {
      // I am available for voice call now, I don't know if you are.
      console.log('group.name', group.name);
      //executionObj[sub].resourceGroups[group.name] = {};
      if (group.functionList.length) {
        executionObj[sub][group.name] = {};
        let currentFuncArray = group.functionList;
        //console.log('currentFuncArray');
        //console.log(currentFuncArray);
        //console.log('webmetrics');
        //console.log(res.locals.webMetrics);
        // executionObj[sub].resourceGroups[group.name]
        currentFuncArray.forEach((func) => {
          //console.log("in the forEach loop");
          //console.log("res.locals.webMetrics[func.name].metrics[0].timeseries[0].data", res.locals.webMetrics[func.name].metrics[0].timeseries[0].data);
          let functionCount = {
            name: func.name,
            id: func.id,
            metricName: 'ExecutionCount',
            timeseries: res.locals.webMetrics[func.name].metrics[0].timeseries[0].data
          }
          //console.log('functionCount')
          //console.log(functionCount);
          executionObj[sub][group.name][functionCount.name] = functionCount;
        });
      } else {
        // do nothing
      }
      /*let currentFuncs = res.locals.subscriptions[sub].resourceGroups[group][group.name].functionList;
      if (currentFuncs.length) {
        console.log('function list');
        console.log(currentFuncs);
        executionObj[sub][group.name] = currentFuncs;
        console.log('here lies the gloomily named execution object'); //lol
        console.log(executionObj);
      }*/
    }
  }
  console.log("executionObj");
  console.log(executionObj);
  res.locals.executionObj = executionObj;
  return next();
};

sdkController.formatAppDetail = (req, res, next) => {
  return next();
};

export default sdkController;