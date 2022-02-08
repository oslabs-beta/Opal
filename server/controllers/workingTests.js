// Commented out tests relating to default azure credential and subscription client.
//const credential = new DefaultAzureCredential();
//const subClient = new SubscriptionClient(credential);
//console.log('tenant id');
//const currentTenant = await subClient.tenants.list().next();
//console.log(currentTenant.value.tenantId);
//console.log('subscription client');
//const currentSubs = await subClient.subscriptions.list().next();
//console.log(currentSubs.value);
//console.log('whole thing');
//console.log(subClient);
//console.log('token')
//const token = await credential.getToken(`api://${CLIENT_ID}/Read`);
//console.log(token);