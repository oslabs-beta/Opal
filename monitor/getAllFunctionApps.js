//Gets all Function Apps from a single Azure subscription. This version uses @azure/arm-resources-subscriptions
import { InteractiveBrowserCredential, DefaultAzureCredential, AzureCliCredential, ChainedTokenCredential }  from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { SubscriptionClient } from "@azure/arm-resources-subscriptions";
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

const subscriptionClient = new SubscriptionClient(credentialChain);

const subscriptionList = async () => {
    const subscriptions = await subscriptionClient.subscriptions.list({top: null});
    console.log(await "subscriptions", subscriptions);
    const subscriptionArray = [];
    for await (const subscription of subscriptions){
        subscriptionArray.push(subscription);
    }
    return subscriptionArray;
}

// console.log("subscription", subscription.subscriptions.list().byPage().next());

const newSubscriptionId = await subscriptionList();

console.log(newSubscriptionId);

//Gets first subscription in a tenant.
console.log(newSubscriptionId[0].subscriptionId);
const subscriptionId = newSubscriptionId[0].subscriptionId;

// console.log(credentialDefault);

// console.log(credentialChain);

// await console.log("identityClient", credentialDefault);

// console.log(subscriptionId);

const resourceClient = new ResourceManagementClient(credentialChain, subscriptionId);

const groupList = async () => {
    // rsg2 Has keys of next, byPage, and [Symbol(Symbol.asyncIterator)]    
    const rsg2 = await resourceClient.resourceGroups.list({top: null});
    // // nextInList only shows one resource group
    // const nextInList = await rsg2.next();
    // console.log(nextInList);
    const groupArray = [];
    for await (const group of rsg2){
        groupArray.push(group);
    }
    return groupArray;
}

const gl = await groupList();
console.log("gl", gl);
// gl.value is an array of all resource groups (objects) with keys of id, name, type, properties, and location
// console.log(gl.value);

// gl.value.forEach(group => console.log(group.name));

const getFunctionAppsInSingleRG = async (rgName) => {
    console.log('in getFunctionAppsInSingleRG');
    const rl = resourceClient.resources.listByResourceGroup(rgName);
    // const byPage = rl.byPage();
    // const next = await byPage.next();
    // console.log("next", next);
    // return next;
    const functionAppList = [];
    for await (const resource of rl){
        if ((resource.kind === 'functionapp' || resource.kind === 'functionapp,linux') && resource.type === 'Microsoft.Web/sites'){
            functionAppList.push(resource);
        }
    }
    console.log("This is functionAppList", functionAppList);
    return functionAppList;
};


// console.log(gl.value[3].name)
// getFunctionAppsInSingleRG(gl[0]);
// console.log(resourceClient.resources.listByResourceGroup(gl.value[0].id))

// console.log(await getFunctionAppsInSingleRG(gl.value[3].name))

// looking for kind: 'functionapp'

// const rsgList = [];

// gl.value.forEach(group => rsgList.push(group.name))

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
    for (let i = 0; i < gl.length; i++){
        console.log("gl[i].name", gl[i].name)
        let fal = await getFunctionAppsInSingleRG( gl[i].name );
        fal.forEach(fa => allFunctionApps.push(fa));
    }
    // console.log(allFunctionApps);
    return allFunctionApps;
};

console.log(await listAllFunctionApps());

export const allFunctionAppsForExport =  await listAllFunctionApps();

console.log("allFunctionAppsForExport", allFunctionAppsForExport);
