import { config } from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { MetricsQueryClient, LogsQueryClient } from '@azure/monitor-query';
import { MSWebOptions, MSInsightsOptions } from '../constants/defaultOptions.js';
import { generateMetric1D, generateMetric2D } from '../utils/metricGenerator.js';
config();

const metricsController = {};

const credential = new DefaultAzureCredential();
const metricQuery = new MetricsQueryClient(credential);
const logsQuery = new LogsQueryClient(credential);

// Get metrics associated with a function application's MS Web provider.
metricsController.getMSWebMetrics = async (req, res, next) => {
  // Default timespan, if not set, is one day.
  if (!res.locals.timespan) {
    res.locals.timespan = 'PT24H';
  }
  let timespan = { duration: res.locals.timespan };

  // Default granularity, if not set, is one hour.
  if (!res.locals.granularity) {
    res.locals.granularity = 'PT1H';
  }
  let granularity = res.locals.granularity;

  let metrics;
  const metricsObj = {};

  if (res.locals.executionOnly === true) {
    // If only seeking function execution count, output only that metric.
    metrics = ['FunctionExecutionCount'];
  } else {
    // If seeking all metrics, get all metrics.
    // Pull metrics at current stage from constants file.
    metrics = generateMetric1D(MSWebOptions);
  }

  const funcQueryArray = [];
  const funcNameArray = [];

  // Query MS Web metrics for every functionApp in the collection of function applications.
  for (let funcApp of res.locals.functionApps) {
    if (!funcApp.id) {
      return next({
        err: 'Error: A resource ID must be set in order to fetch metrics for a function.',
      });
    }
    const query = metricQuery
      .queryResource(funcApp.id, metrics, {
        granularity: granularity,
        timespan: timespan,
      })
      .catch((err) => {
        return next({
          err: `Attempt to query MS Web metrics for ${funcApp.id} failed, with message ${err}.`,
        });
      });
    // Push results of the query and name of the function application into parallel arrays.
    funcQueryArray.push(query);
    funcNameArray.push(funcApp.name);
  }

  // Consider Promise.allSettled for circumstances in which fewer than all queries will run.
  Promise.all(funcQueryArray)
    .then((queryResultArray) => {
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
      with error ${err}.`,
      });
    });
};

// Retrieve the MS Insights metrics associated with a function application.
metricsController.getMSInsightsMetrics = async (req, res, next) => {
  // Default timespan is one day.
  if (!res.locals.timespan) {
    res.locals.timespan = 'PT24H';
  }
  let timespan = { duration: res.locals.timespan };

  // Default granularity is one hour.
  if (!res.locals.granularity) {
    res.locals.granularity = 'PT1H';
  }
  let granularity = res.locals.granularity;

  // Pull metrics at current stage from constants file.
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
      timespan: timespan,
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
        with error ${err}.`,
      });
    });
};

metricsController.retrieveFunctionLogs = async (req, res, next) => {
  const { azureLogAnalyticsWorkspaceId, functionName, granularity, timespan } = res.locals.azure.specificFunction;
  const kustoQuery = `AppRequests | project OperationName, TimeGenerated, Success, ResultCode, DurationMs | where OperationName contains \'${functionName}\' | sort by TimeGenerated asc nulls first`;
  const logRes = await logsQuery.queryWorkspace(azureLogAnalyticsWorkspaceId, kustoQuery, {
    duration: timespan,
  });
  // Properties removed from query: Id, OperationId, TenantId, Measurements, AppRoleName, Type, Name, AppRoleInstance.
  res.locals.funcResponse = metricsController.processTable(logRes, granularity);
  return next();
};

metricsController.processTable = function (logObject, granularity) {
  const table = logObject.tables[0];
  const columnArray = [];
  table.columns.forEach((column) => {
    columnArray.push(column.name);
  });
  const logArray = [];

  // Round date to selected granularity.
  function roundDate (mins, dateVal) {
    let ms = 1000 * 60 * mins;
    return new Date(Math.round(dateVal.getTime() / ms) * ms).toString();
  }

  // Process tables and round dates from TimeGenerated.
  for (let row = 0; row < table.rows.length; row++) {
    let logEntry = {};
    for (let prop = 0; prop < table.rows[row].length; prop++) {
      let currentRow = table.rows[row];
      if (columnArray[prop] !== 'TimeGenerated') {
        logEntry[columnArray[prop]] = currentRow[prop];
      } else {
        logEntry.timeStamp = roundDate(granularity, currentRow[prop]);
      }
    }
    logArray.push(logEntry);
  }
  // Convert into a timeseries.
  const seriesMap = new Map();
  // Generate timeseries and sum success and failure counts.
  for (let data of logArray) {
    if (!seriesMap.has(data.timeStamp)) {
      // If we do not have this time in our map, create an object, initializing successCount, failCount, and delayArray.
      let currentDelay = data.DurationMs;
      seriesMap.set(data.timeStamp, {
        operationName: data.OperationName,
        timeStamp: data.timeStamp,
        successCount: data.ResultCode === "200" ? 1 : 0,
        failCount: data.ResultCode !== "200" ? 1: 0,
        delayArray: [currentDelay]
      });
      console.log('MAP');
      console.log(seriesMap.get(data.timeStamp));
    } else {
      // If we already have this time in our map, increment the success or failure counter, push new delay to array.
      const delayArray = seriesMap.get(data.timeStamp).delayArray;
      delayArray.push(data.DurationMs);
      let currentSuccess = seriesMap.get(data.timeStamp).successCount;
      let currentFail = seriesMap.get(data.timeStamp).failCount;
      data.ResultCode === "200" ? ++currentSuccess : ++currentFail;
      seriesMap.set(data.timeStamp, {
        operationName: data.OperationName,
        successCount: currentSuccess,
        failCount: currentFail,
        timeStamp: data.timeStamp,
        delayArray: delayArray,
      });
    }
  }

  // Convert Map iterator to an array.
  const values = seriesMap.values();
  const outputTableArray = Array.from(values);

  // In the output table, reduce the 'delay' array into a single integer that represents the average delay during that timespan.
  outputTableArray.forEach((timeseries) => {
    let delayArr = timeseries.delayArray;
    let delayArrLen = delayArr.length;
    if (!delayArrLen) timeseries.delay = 0;
    else timeseries.delay = Math.trunc(delayArr.reduce((prev, cur) => prev + cur) / delayArr.length);
    delete timeseries.delayArray;
  });
  return outputTableArray;
};


// Currently not using storage controller, but may be used for future development.
// metricsController.getStorageMetrics = async (req, res, next) => {
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
//  return next();
// };

export default metricsController;
