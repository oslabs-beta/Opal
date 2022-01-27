import { config } from 'dotenv';
// No longer need simulators for now.
// Could possibly dispense with other identities.
import { DefaultAzureCredential } from '@azure/identity';
//import { ResourceManagementClient } from '@azure/arm-resources';
import { MetricsQueryClient } from '@azure/monitor-query';
//import { SubscriptionClient } from '@azure/arm-resources-subscriptions';
import { MSInsightsSimulator, MSStorageSimulator, MSWebSimulator } from '../constants/frontendSimulator.js';
config();

const functionMetricsController = {};
// Moving this up.
const credential = new DefaultAzureCredential();
const metricQuery = new MetricsQueryClient(credential);

functionMetricsController.getMSWebMetrics = async (req, res, next) => {
  const start = new Date();
  // functionMetricsController.getMetrics gets all MS Web apps from function apps
  // based on the criteria selected in frontendSimulator.js
  let metrics;
  const metricsObj = {};
  if (res.locals.executionOnly === true) {
    // If user is only looking for function execution count, output that only.
    metrics = ['FunctionExecutionCount'];
  } else {
    // If use is looking for all metrics, get all metrics.
    metrics = functionMetricsController.generateMetric1D(MSWebSimulator);
    // Get all metrics.
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
  console.log('getting MS Web metrics took');
  console.log(end - start);
  console.log('milliseconds');
};

functionMetricsController.getMSInsightsMetrics = async (req, res, next) => {
  console.log('inMsInsights');
  const start = new Date();
  const metrics = functionMetricsController.generateMetric2D(MSInsightsSimulator).split(',');
  const metricsArray = [];

  const promiseArray = [];
  const nameArray = [];

  for (const resource of res.locals.functionApps) {
    // const name = resource.name;
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
    console.log('result');
    console.log(result);
    promiseArray.push(result);
    nameArray.push(resource.name);
  }

  console.log('promiseArray', promiseArray);
  console.log('nameArray', nameArray);
  /*
  Promise.all(promiseArray).then((queryResultArray) => {
    for (let i = 0; i < queryResultArray.length; i++) {
      let currentFunc = queryResultArray[i];
      for (let j = 0; j < currentFunc.metrics.length; j++) {
        let currentMetric = currentFunc.metrics[j];
        currentMetric.timeseries = currentMetric.timeseries[0].data;
      }
      metricsObj[idArray[i]] = queryResultArray[i];
    }
    res.locals.webMetrics = metricsObj;*/
  Promise.all(promiseArray)
    .then((queryResultArray) => {
      console.log('queryResultArray', queryResultArray);
      for (let i = 0; i < queryResultArray.length; i++) {
        //let currentFunc = queryResultArray[i];
        queryResultArray[i].name = nameArray[i];
        metricsArray.push(queryResultArray[i]);
      }
      // metricsArray.push(queryResultArray);
      console.log('metricsArray', metricsArray);
    })
    .then(() => {
      res.locals.insightsMetrics = metricsArray;
      console.log('res.locals.insightsMetrics', res.locals.insightsMetrics);
      const end = new Date();
      console.log('Fetching MS insights metrics took');
      console.log(end - start);
      console.log('millisecnds');
      return next();
    });

  // result.name = name;
  // metricsArray.push(result);

  // const promiseArray = [];
  // const idArray = [];
  // for (let app of res.locals.functionApps) {
  //   if (!app.id) {
  //     return next({
  //       err: 'Resource ID must be set to fetch metrics for function.',
  //     });
  //   }
  //     const query = metricQuery.queryResource(app.id, metrics, {
  //       granularity: 'PT1H',
  //       timespan: { duration: 'PT24H' },
  //     });
  //   promiseArray.push(query);
  //   idArray.push(app.name);
  // };

  // Promise.all(promiseArray).then((queryResultArray) => {
  //   for (let i = 0; i < queryResultArray.length; i++) {
  //     metricsObj[idArray[i]] = queryResultArray[i];
  //   }
  //   res.locals.webMetrics = metricsObj;
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
