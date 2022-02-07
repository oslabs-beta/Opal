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
  let metrics;
  const metricsObj = {};
  if (res.locals.executionOnly === true) {
    // If only seeking function execution count, output only that metric.
    metrics = ['FunctionExecutionCount'];
  } else {
    // If seeking all metrics, get all metrics.
    metrics = generateMetric1D(MSWebOptions);
  }
  const promiseArray = [];
  const idArray = [];
  for (let app of res.locals.functionApps) {
    if (!app.id) {
      return next({
        err: 'Resource ID must be set to fetch metrics for function.',
      });
    }
    const query = metricQuery.queryResource(app.id, metrics, {
      granularity: 'PT1H',
      timespan: { duration: 'PT24H' },
    });
    promiseArray.push(query);
    idArray.push(app.name);
  }

  Promise.all(promiseArray).then((queryResultArray) => {
    for (let i = 0; i < queryResultArray.length; i++) {
      let currentFunc = queryResultArray[i];
      for (let j = 0; j < currentFunc.metrics.length; j++) {
        let currentMetric = currentFunc.metrics[j];
        currentMetric.timeseries = currentMetric.timeseries[0].data;
      }
      metricsObj[idArray[i]] = queryResultArray[i];
    }
    res.locals.webMetrics = metricsObj;
    return next();
  });

  const end = new Date();
};

metricsController.getMSInsightsMetrics = async (req, res, next) => {
  const start = new Date();
  const metrics = generateMetric2D(MSInsightsOptions).split(',');
  const metricsArray = [];

  const promiseArray = [];
  const nameArray = [];

  for (const resource of res.locals.functionApps) {
    const resId = resource.insightId;
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for resource.',
      });
    }
    const result = metricQuery.queryResource(resId, metrics, {
      granularity: 'PT1H',
      timespan: { duration: 'PT24H' },
      //aggregations: ['Count']
    });
    promiseArray.push(result);
    nameArray.push(resource.name);
  }

  Promise.all(promiseArray)
    .then((queryResultArray) => {
      // for each function in the query result.
      for (let i = 0; i < queryResultArray.length; i++) {
        let currentFunc = queryResultArray[i];
        currentFunc.name = nameArray[i];
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
    });
};


// Storage metrics controller is not currently being used.
metricsController.getStorageMetrics = async (req, res, next) => {
  const metrics = generateMetric1D(MSStorageOptions);
  const metricsArray = [];
  for await (let resource of res.locals.storageList) {
    const resId = resource.id;
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for resource.',
      });
    }
    const result = await metricQuery.queryResource(resId, metrics, {
      granularity: 'PT1H',
      timespan: { duration: 'PT24H' },
      //aggregations: ['Count']
    });
    metricsArray.push(result);
  }
  res.locals.storageMetrics = metricsArray;
  return next();
};


metricsController.retrieveFunctionLogs = async (req, res, next) => {
  // For some reason only logres2 is working right now.
   // See whether we can retrieve this with the QueryInsights SDK instead, since this uses specific table names.
   // Also investigate impact of migration to workspaces on this.

  const {azureLogAnalyticsWorkspaceId, functionName} = res.locals.azure.specificFunction;

  const kustoQuery1 = `AppExceptions | project TimeGenerated, Id | where OperationName contains \'${functionName}\'`;
  const kustoQuery2 = `AppRequests | project TimeGenerated, Id, OperationName, Success, DurationMs, OperationId, AppRoleInstance, AppRoleName, ItemCount, ResultCode | where OperationName contains \'${functionName}\'`;
  const kustoQuery3 = `AppBrowserTimings | project AppRoleName, Measurements, Name, OperationId, OperationName, ProcessingDurationMs, ReceiveDurationMs, SendDurationMs, TotalDurationMs | where OperationName contains \'${functionName}\'`;

//   const logRes1 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery1, {
//     //duration: Durations.sevenDays,
//     duration: "P10D",
//   });
// console.log(logRes1.tables[0]);
// res.locals.funcResponse = metricsController.processTable(logRes1);

  const logRes2 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery2, {
      //duration: Durations.sevenDays,
      duration: "P10D",
    });
  console.log(logRes2.tables[0]);
  res.locals.funcResponse = metricsController.processTable(logRes2);

  // const logRes3 = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery3, {
  //   //duration: Durations.sevenDays,
  //   duration: "P10D",
//   // });
// console.log(logRes3.tables[0]);
// res.locals.funcResponse = metricsController.processTable(logRes3);
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
