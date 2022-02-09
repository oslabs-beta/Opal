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

/*
const kustoQuery0 = 'search * | distinct $table | sort by $table asc nulls last';

const kustoQuery1 = `AppExceptions | where OperationName contains \'${functionName}\'`;

  // Keeping out 'Properties,' which adds a lot of extra bulk.

  const kustoQuery3 = `AppBrowserTimings | project AppRoleName, Measurements, Name, OperationId, OperationName, ProcessingDurationMs, ReceiveDurationMs, SendDurationMs, TotalDurationMs | where OperationName contains \'${functionName}\'`;

  const kustoQuery4 = `AppMetrics | where OperationName contains \'${functionName}\'`;

  const kustoQuery5 = 'AppEvents | project TimeGenerated, Name, AppRoleInstance | order by TimeGenerated asc | limit 10';

  const kustoQuery6 = `AppSystemEvents | project TimeGenerated, ProblemId | where OperationName contains \'${functionName}\'`;

  const kustoQuery7 = `AppRequests | top 20 by Name desc nulls last`;



*/

  /* Table Options
  [ 'AppExceptions' ],
[0]     [ 'AppMetrics' ],
[0]     [ 'AppPerformanceCounters' ],
[0]     [ 'AppRequests' ],
[0]     [ 'AppSystemEvents' ],
[0]     [ 'AppTraces' ],
[0]     [ 'Usage' ]
*/

  // Note: Queries 1, 2, 3 currently work, queries 1 and 4 do not.

  //   const logRes1 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery1, {
  //     //duration: Durations.sevenDays,
  //     duration: 'P14D',
  //   });
  // console.log(logRes1.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes1);


  //   const logRes4 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery4, {
  //     //duration: Durations.sevenDays,
  //     duration: "P14D",
  //   });
  // console.log(logRes4.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes4);

  //   const logRes5 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery1, {
  //     //duration: Durations.sevenDays,
  //     duration: "P14D",
  //   });
  // console.log(logRes5.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes5);

  //   const logRes3 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery3, {
  //     //duration: Durations.sevenDays,
  //     duration: "P14D",
  //  });
  // console.log(logRes3.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes3);

  // const logRes6 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery6, {
  //   //duration: Durations.sevenDays,
  //   duration: "P14D",
  // });
  // console.log(logRes6.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes6);

  // const logRes7 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery7, {
  //   //duration: Durations.sevenDays,
  //   duration: "P14D",
  // });
  // console.log(logRes7.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes7);

  // const logRes0 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery0, {
  //   //duration: Durations.sevenDays,
  //   duration: "P14D",
  // });
  // console.log(logRes0.tables[0]);
  // res.locals.funcResponse = metricsController.processTable(logRes0);
