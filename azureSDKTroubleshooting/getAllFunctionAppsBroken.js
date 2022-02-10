//Gets all Function Apps from a single Azure subscription. This version uses @azure/arm-subscriptions. Work in progress. 
//Does not work according to the documentation (https://docs.microsoft.com/en-us/azure/developer/javascript/core/nodejs-sdk-azure-authenticate?tabs=azure-sdk-for-javascript#3-list-azure-subscriptions-with-service-principal)
// because .list() does not result in something iterable. For something that works see getAllFunctionApp.js
import { InteractiveBrowserCredential, DefaultAzureCredential, AzureCliCredential, ChainedTokenCredential }  from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-subscriptions";
import dotenv from "dotenv";
// import { KeysClient } from "@azure/keyvault-keys";
// import { nodeModuleNameResolver } from "typescript";

dotenv.config();

const credentialBrowser = new InteractiveBrowserCredential();
const credentialDefault = new DefaultAzureCredential();
const credentialCli = new AzureCliCredential();
//credentialDefault has to be the first parameter or it won't work.
const credentialChain = new ChainedTokenCredential(credentialDefault, credentialBrowser, credentialCli);

// const subscriptionId = process.env.SUBSCRIPTION_ID;

const client = new SubscriptionClient(credentialChain);

const subscriptions = async() =>{

    // get list of Azure subscriptions
    const listOfSubscriptions = client.subscriptions.list();
    
    const containerOfSubscriptions = [];

    // get details of each subscription
    for (const item of listOfSubscriptions) {
    
        const subscriptionDetails = await client.subscriptions.get(item.subscriptionId);
    
        /*
      
        Each item looks like:
      
        {
          id: '/subscriptions/123456',
          subscriptionId: '123456',
          displayName: 'YOUR-SUBSCRIPTION-NAME',
          state: 'Enabled',
          subscriptionPolicies: {
            locationPlacementId: 'Internal_2014-09-01',
            quotaId: 'Internal_2014-09-01',
            spendingLimit: 'Off'
          },
          authorizationSource: 'RoleBased'
        },
      
        */
    
        console.log(subscriptionDetails)
        containerOfSubscriptions.push(subscriptionDetails);
    }
    return containerOfSubscriptions;
  }

const newSubscriptionId = subscriptions();
console.log(newSubscriptionId);

//Gets first subscription in a tenant.
const subscriptionId = newSubscriptionId.value[0].subscriptionId;

// console.log(credentialDefault);

// console.log(credentialChain);

// await console.log("identityClient", credentialDefault);

// console.log(subscriptionId);

const resourceClient = new ResourceManagementClient(credentialChain, subscriptionId);

const groupList = async () => {
    // rsg2 Has keys of next, byPage, and [Symbol(Symbol.asyncIterator)]    
    const rsg2 = resourceClient.resourceGroups.list();
    // // nextInList only shows one resource group
    // const nextInList = await rsg2.next();
    // console.log(nextInList);
    const byPage = rsg2.byPage();
    const next = await byPage.next();
    return next;
}

const gl = await groupList();
// gl.value is an array of all resource groups (objects) with keys of id, name, type, properties, and location
// console.log(gl.value);

// gl.value.forEach(group => console.log(group.name));

const getFunctionAppsInSingleRG = async (rg) => {
    const rl = resourceClient.resources.listByResourceGroup(rg);
    const byPage = rl.byPage();
    const next = await byPage.next();
    // console.log(next);
    // return next;
    const functionAppList = [];
    next.value.forEach(resource => {
        if ((resource.kind === 'functionapp' || resource.kind === 'functionapp,linux') && resource.type === 'Microsoft.Web/sites'){
            functionAppList.push(resource);
        }
    })
    // console.log("This is functionAppList", functionAppList);
    return functionAppList;
};


// console.log(gl.value[3].name)
// getFunctionAppsInSingleRG(gl.value[3].name);
// console.log(resourceClient.resources.listByResourceGroup(gl.value[0].id))

// console.log(await getFunctionAppsInSingleRG(gl.value[3].name))

// looking for kind: 'functionapp'

const rsgList = [];

gl.value.forEach(group => rsgList.push(group.name))

// console.log("rsgList", rsgList);



const listAllFunctionApps = async () => {
    const allFunctionApps = [];
    // Due to async, this needs to be refactored in to for let loop.
    // rsgList.forEach( async (rsg) => {
    //     let fal = await getFunctionAppsInSingleRG(rsg);
    //     // console.log("fal", fal);
    //     fal.forEach(fa => allFunctionApps.push(fa));
    //     // console.log("allFunctionApps", allFunctionApps);

    // })
    for (let i = 0; i < rsgList.length; i++){
        let fal = await getFunctionAppsInSingleRG( rsgList[i] );
        fal.forEach(fa => allFunctionApps.push(fa));
    }
    // console.log(allFunctionApps);
    return allFunctionApps;
};

console.log(await listAllFunctionApps());

export const allFunctionAppsForExport =  await listAllFunctionApps();

console.log(allFunctionAppsForExport);
