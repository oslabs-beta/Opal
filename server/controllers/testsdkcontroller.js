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
  return next();
};

sdkController.fetchResources = async (req, res, next) => {

  const functionAppArray = [];
  // for every resource group.
  // NOTE: cannot use foreach with async-await.
  for (let id in res.locals.subscriptions) {
    // resource groups are presented as arrays
    for (let group in res.locals.subscriptions[id].resourceGroups) {
      const rmc = res.locals.subscriptions[id].rmc;
      const resources = rmc.resources.listByResourceGroup(res.locals.subscriptions[id].resourceGroups[group].name);
      const resourcesByPage = resources.byPage();
      // assume only one page
      const allResources = await resourcesByPage.next();
      const functionList = [];
      allResources.value.forEach((app) => {
        if ((app.kind === 'functionapp' || app.kind === 'functionapp,linux') && app.type === 'Microsoft.Web/sites') {
          functionList.push(app);
        }
      });
      res.locals.subscriptions[id].resourceGroups[group].functionList = functionList;
    }
  }
  //  console.log('subscriptions');
  for (const sub in res.locals.subscriptions) {
    for (const resourceGroup in res.locals.subscriptions[sub].resourceGroups) {
      console.log('contents of current resource group');
      console.log(res.locals.subscriptions[sub].resourceGroups[resourceGroup]);
      for (const functionApp in res.locals.subscriptions[sub].resourceGroups[resourceGroup].functionList) {
        let currentApp = res.locals.subscriptions[sub].resourceGroups[resourceGroup].functionList[functionApp];
        console.log(currentApp);
        functionAppArray.push(currentApp);
      }
    }
  }
  console.log('subscriptions');
  console.log(res.locals.subscriptions);

  for (const sub in res.locals.subscriptions) {
    delete res.locals.subscriptions[sub].rmc;
  }

  res.locals.functionApps = functionAppArray;

  console.log('subscriptions');
  console.log(res.locals.subscriptions);

  return next();
};
export default sdkController;
