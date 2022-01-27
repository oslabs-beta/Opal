import { config } from 'dotenv';
// No longer need simulators for now.
// Could possibly dispense with other identities.
import { DefaultAzureCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import { Durations, MetricsQueryClient } from '@azure/monitor-query';
import { SubscriptionClient } from '@azure/arm-resources-subscriptions';
import { MSInsightsSimulator, MSStorageSimulator, MSWebSimulator } from '../constants/frontendSimulator.js';
config();

const functionMetricsController = {};
// Moving this up.
const credential = new DefaultAzureCredential();
const metricQuery = new MetricsQueryClient(credential);

functionMetricsController.getMSWebMetrics = async (req, res, next) => {
  // functionMetricsController.getMetrics gets all MS Web apps from function apps
  // based on the criteria selected in frontendSimulator.js
  let metrics;
  const metricsObj = {};
  console.log('in MSWebMetrics');
  if (res.locals.executionOnly === true) {
    // If user is only looking for function execution count, output that only.
    metrics = ['FunctionExecutionCount'];
  } else {
    // If use is looking for all metrics, get all metrics.
    console.log('getting all metrics');
    metrics = functionMetricsController.generateMetric1D(MSWebSimulator);
    // Get all metrics.
  }
  console.log('function apps');
  console.log(res.locals.functionApps);
  const promiseArray = [];
  const idArray = [];
  for (let app of res.locals.functionApps) {
    if (!app.id) {
      return next({
        err: 'Resource ID must be set to fetch metrics for function.',
      });
    }
    //const promise = new Promise((resolve, reject) => {
      const query = metricQuery.queryResource(app.id, metrics, {
        granularity: 'PT1H',
        timespan: { duration: 'PT24H' },
      });
    promiseArray.push(query);
    idArray.push(app.id);
  };

  Promise.all(promiseArray).then((queryResultArray) => {
    console.log('results');
    console.log(queryResultArray);
    // each array element has a .name (app.id) and a respones (response).
    for (let i = 0; i < queryResultArray.length; i++) {
      metricsObj[idArray[i]] = queryResultArray[i];
    }
    console.log("metricsObj", metricsObj);
    res.locals.webMetrics = metricsObj;
    return next();
  });
  //Promise.all(promiseArray);
    //.then((result) => (metricsObj[app.name] = result));
  // promiseArray.push(result);
  // metricsObj[app.name] = result;
  // res.locals.webMetrics = metricsObj;
};

functionMetricsController.getMSInsightsMetrics = async (req, res, next) => {
  const metrics = functionMetricsController.generateMetric2D(MSInsightsSimulator).split(',');
  const metricsArray = [];

  // Alma: on lines 71-73 of functionMetricsController, I changed the id being used to
  // the 'insightId' associated with the function app.
  // The other changes I made were (1) adding the 'insightId' to
  // the data that is sent from the frontend to the backend (line 415 of SDKController)
  // and (2) associating the 'insightId' with a function (line 93 of SDK Controller).
  // This is pushing the right metrics into 'insightMetrics', but I have not hooked it up to send
  // the data back to the client yet.

  for await (let resource of res.locals.functionApps) {
    const name = resource.name;
    const resId = resource.insightId;
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
    result.name = name;
    metricsArray.push(result);
  }

  console.log('here is the current function data on res.locals');
  // res.locals.functionApps is an array of function app objects, each of which has: name, id, location, insightId
  console.log(res.locals.functionApps);
  res.locals.insightsMetrics = metricsArray;
  console.log('here are the metrics from MS insights');
  // res.locals.metrics is an array of metric objects, each of which has cost, namespace, metrics, timespan, resource, granularity
  console.log(res.locals.insightsMetrics);
  return next();
};

// Storage metrics controller is not currently being used.
functionMetricsController.getStorageMetrics = async (req, res, next) => {
  const metrics = functionMetricsController.generateMetric1D(MSStorageSimulator);
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

// this is a duplicate of what appears in performancecontroller. Only need one of each.

// functionMetricsController.generateMetric1D takes in a 1-level object identifying properties
// that the user may want as metrics. It will output into an array only those metrics
// that are currently set to 'true.'
functionMetricsController.generateMetric1D = function (resObj) {
  let metricArray = [];
  for (let key in resObj) {
    if (resObj[key] === true) {
      metricArray.push(key);
    }
  }
  return metricArray;
};

functionMetricsController.generateMetric2D = function (resObj) {
  // outputs chosen metrics as a string.
  let metricString = '';
  for (let keyTopLevel in resObj) {
    for (let keyBottomLevel in resObj[keyTopLevel]) {
      if (resObj[keyTopLevel][keyBottomLevel] === true) {
        metricString += keyTopLevel + '/' + keyBottomLevel + ',';
      }
    }
  }
  return (metricString = metricString.slice(0, metricString.length - 1));
};

export default functionMetricsController;
