//Gets all Function Apps from a single Azure subscription.
import { DefaultAzureCredential, AzureCliCredential }  from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import dotenv from "dotenv";
import { nodeModuleNameResolver } from "typescript";

dotenv.config();

const credential = new AzureCliCredential();

const subscriptionId = process.env.SUBSCRIPTION_ID;

console.log(subscriptionId);

const resourceClient = new ResourceManagementClient(credential, subscriptionId);

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

const allFunctionAppsForExport =  await listAllFunctionApps();

console.log(allFunctionAppsForExport);

module.exports = allFunctionAppsForExport;