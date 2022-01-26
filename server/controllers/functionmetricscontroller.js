import { config } from 'dotenv';
// No longer need simulators for now.
// Could possibly dispense with other identities.
import { DefaultAzureCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import {Durations, MetricsQueryClient } from '@azure/monitor-query';
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
  const metrics = functionMetricsController.generateMetric1D(MSWebSimulator);
  const metricsArray = [];
  for await (let app of res.locals.functionApps) {
    const resId = app.id;
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for function.',
      });
    }
    const result = await metricQuery.queryResource(resId, metrics, {
      granularity: 'PT6H',
      timespan: {duration: 'PT48H'},
      //aggregations: ['Count']
    });
    metricsArray.push(result);
  }
  res.locals.webMetrics = metricsArray;
  return next();
};

functionMetricsController.getMSInsightsMetrics = async (req, res, next) => {
  const metrics = functionMetricsController.generateMetric2D(MSInsightsSimulator);
  const metricsArray = [];
  for await (let resource of res.locals.storageList) {
    const resId = resource.id;
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for resource.'
      });
    }
    const result = await metricQuery.queryResource(resId, metrics, {
      granularity: 'PT6H',
      timespan: {duration: 'PT48H'},
      //aggregations: ['Count']
    });
    metricsArray.push(result);
  }
  res.locals.insightsMetrics = metricsArray;
  return next();
}

functionMetricsController.getStorageMetrics = async (req, res, next) => {
  const metrics = functionMetricsController.generateMetric1D(MSStorageSimulator);
  const metricsArray = [];
  for await (let resource of res.locals.storageList) {
    const resId = resource.id;
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for resource.'
      });
    }
    const result = await metricQuery.queryResource(resId, metrics, {
      granularity: 'PT6H',
      timespan: {duration: 'PT48H'},
      //aggregations: ['Count']
    });
    metricsArray.push(result);
  }
  res.locals.storageMetrics = metricsArray;
  return next();
}

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
