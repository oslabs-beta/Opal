import { config } from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { MetricsQueryClient, LogsQueryClient } from '@azure/monitor-query';
import { MSWebOptions, MSInsightsOptions, MSStorageOptions } from '../constants/defaultOptions.js';
import { generateMetric1D, generateMetric2D } from '../utils/metricGenerator.js';
config();

const metricsController = {};

const credential = new DefaultAzureCredential();
const metricQuery = new MetricsQueryClient(credential);
const logsQuery = new LogsQueryClient(credential);

// Get metrics associated with a function application's MS Web provider.
metricsController.getMSWebMetrics = async (req, res, next) => {
  // Set granularity and timespan dynamically once they are passed from the frontend.
  // For now, set them statically to hour-by-hour, for a 24-hour period.
  let granularity = 'PT1H';
  //let timespan = {duration: 'PT24H'};
  let timespan = {duration: '2022-01-26T23:03:24.604Z/2022-01-27T23:03:24.604Z' }
  //let timespan = {
  //  start_time: '2022-02-06T21:03:24.604Z',
  //  end_time: '2022-02-07T21:03:24.604Z'
  //}
  let metrics;
  const metricsObj = {};

  if (res.locals.executionOnly === true) {
    // If only seeking function execution count, output only that metric.
    metrics = ['FunctionExecutionCount'];
  } else {
    // If seeking all metrics, get all metrics.
    metrics = generateMetric1D(MSWebOptions);
  }

  const funcQueryArray = [];
  const funcNameArray = [];

  // Query MS Web metrics for every functionApp in the collection of function applications.
  for (let funcApp of res.locals.functionApps) {
    // Consistent formatting of error message.
    if (!funcApp.id) {
      return next({
        err: 'Error: A resource ID must be set in order to fetch metrics for a function.',
      });
    }
    const query = metricQuery.queryResource(funcApp.id, metrics, {
      granularity: granularity,
      timespan: timespan
    })
    .catch((err) => {
      return next({
        err: `Attempt to query MS Web metrics for ${funcApp.id} failed, with message ${err}.`
      });
    });
    // Push results of the query and name of the function application into parallel arrays.
    funcQueryArray.push(query);
    funcNameArray.push(funcApp.name);
  }

  // Consider Promise.allSettled if we want to accept possibility that fewer than all queries will run.
  Promise.all(funcQueryArray).then((queryResultArray) => {
    for (let i = 0; i < queryResultArray.length; i++) {
      let currentFunc = queryResultArray[i];
      for (let j = 0; j < currentFunc.metrics.length; j++) {
        let currentMetric = currentFunc.metrics[j];
        currentMetric.timeseries = currentMetric.timeseries[0].data;
      }
      metricsObj[funcNameArray[i]] = queryResultArray[i];
    }
    res.locals.webMetrics = metricsObj;
    return next();
  })
  .catch((err) => {
    return next({
      err: `Querying MS Web metrics failed. Unable to retrieve metrics for one or more function applications,
      with error ${err}.`
    });
  });
};

// Retrieve the MS Insights metrics associated with a function application.
metricsController.getMSInsightsMetrics = async (req, res, next) => {
  // Set granularity and timespan dynamically once they are passed from the frontend.
  // For now, set them statically to hour-by-hour, for a 24-hour period.
  let granularity = 'PT1H';
  //let timespan = {duration: 'PT24H'};
  let timespan = {duration: '2022-01-26T23:03:24.604Z/2022-01-27T23:03:24.604Z' }

  // For now, metrics are selected statically.
  const metrics = generateMetric2D(MSInsightsOptions).split(',');
  const metricsArray = [];

  const funcQueryArray = [];
  const funcNameArray = [];

  // Run MS Insights query for each function application in the collection of function applications.
  for (const functionApp of res.locals.functionApps) {
    const resId = functionApp.insightId;
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for function application.',
      });
    }
    const result = metricQuery.queryResource(resId, metrics, {
      granularity: granularity,
      timespan: timespan
      //aggregations: ['Count']
    });

    // Push the results of the query and the function's name into parallel arrays.
    funcQueryArray.push(result);
    funcNameArray.push(functionApp.name);
  }

  // Once all queries are complete, push the retrieved metrics into a single array (metricsArray).
  Promise.all(funcQueryArray)
    .then((queryResultArray) => {
      for (let i = 0; i < queryResultArray.length; i++) {
        let currentFunc = queryResultArray[i];
        currentFunc.name = funcNameArray[i];
        for (let j = 0; j < currentFunc.metrics.length; j++) {
          let currentMetric = currentFunc.metrics[j];
          currentMetric.timeseries = currentMetric.timeseries[0].data;
        }
        metricsArray.push(queryResultArray[i]);
      }
    })
    .then(() => {
      res.locals.insightsMetrics = metricsArray;
      return next();
    })
    .catch((err) => {
      return next({
        err: `Querying MS Insights metrics failed. Unable to retrieve metrics for one or more function applications,
        with error ${err}.`
      });
    });
};

// Storage metrics controller is not currently being used.
metricsController.getStorageMetrics = async (req, res, next) => {
  // const metrics = generateMetric1D(MSStorageOptions);
  // const metricsArray = [];
  // for await (let resource of res.locals.storageList) {
  //   const resId = resource.id;
  //   if (!resId) {
  //     return next({
  //       err: 'Resource ID must be set to fetch metrics for resource.',
  //     });
  //   }
  //   const result = await metricQuery.queryResource(resId, metrics, {
  //     granularity: 'PT1H',
  //     timespan: { duration: 'PT24H' },
  //     //aggregations: ['Count']
  //   });
  //   metricsArray.push(result);
  // }
  // res.locals.storageMetrics = metricsArray;
  return next();
};


metricsController.retrieveFunctionLogs = async (req, res, next) => {
  // For some reason only logres2 is working right now.
   // See whether we can retrieve this with the QueryInsights SDK instead, since this uses specific table names.
   // Also investigate impact of migration to workspaces on this.

  const {azureLogAnalyticsWorkspaceId, functionName} = res.locals.azure.specificFunction;

  const kustoQuery0 = 'search * | distinct $table | sort by $table asc nulls last';

  const kustoQuery1 = `AppExceptions | where OperationName contains \'${functionName}\'`;

  const kustoQuery2 = `AppRequests | project TenantId, TimeGenerated, Id, Name, OperationName, Success, ResultCode, DurationMs, OperationId, AppRoleInstance, AppRoleName, Measurements, Type | where OperationName contains \'${functionName}\'`;

  // Keeping out 'Properties,' which adds a lot of extra bulk.

  const kustoQuery3 = `AppBrowserTimings | project AppRoleName, Measurements, Name, OperationId, OperationName, ProcessingDurationMs, ReceiveDurationMs, SendDurationMs, TotalDurationMs | where OperationName contains \'${functionName}\'`;

  const kustoQuery4 = `AppMetrics | where OperationName contains \'${functionName}\'`;

  const kustoQuery5 = 'AppEvents | project TimeGenerated, Name, AppRoleInstance | order by TimeGenerated asc | limit 10'

  const kustoQuery6 = `AppSystemEvents | project TimeGenerated, ProblemId | where OperationName contains \'${functionName}\'`;

  const kustoQuery7 = `AppRequests | top 20 by Name desc nulls last`;

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
//     duration: "P14D",
//   });
// console.log(logRes1.tables[0]);
// res.locals.funcResponse = metricsController.processTable(logRes1);

  const logRes2 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery2, {
      //duration: Durations.sevenDays,
      duration: "P14D",
    });
  console.log(logRes2.tables[0]);
  res.locals.funcResponse = metricsController.processTable(logRes2);

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


  return next();
}

// Deprecated.
metricsController.applicationInsights = async (req, res, next) => {
  //const APPINSIGHTS_INSTRUMENTATIONKEY = '31fb4e2d-a4e4-4315-831e-4e591186cbfe';
  //appInsights.setup();
  //appInsights.loadAppInsights();
  //appInsights.trackPageView();
  return next();
};

metricsController.processTable = function(logObject) {
  const table = logObject.tables[0];
  const columnArray = [];
  table.columns.forEach((column) => {
    columnArray.push(column.name);
  });
  const logArray = [];
  table.rows.forEach((row) => {
    const logEntry = {};
    for (let i = 0; i < table.rows.length; i++) {
      let currentRow = table.rows[i];
      logEntry[columnArray[i]] = currentRow[i];
    }
    logArray.push(logEntry);
  });
  return logArray;
}

export default metricsController;
