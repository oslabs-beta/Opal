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

functionMetricsController.getMetrics = async (req, res, next) => {
  const credential = new DefaultAzureCredential();
  const metricQuery = new MetricsQueryClient(credential);
  const metrics = functionMetricsController.generateMetric1D(MSWebSimulator).split(',');

  console.log('metrics');
  console.log(metrics);
  console.log(typeof metrics);

  // the sdk controller will expoert an array of objects, each of which represents a function app.
  // the format of each object in the array is as follows:
  /*
  id: resourceId (to be plugged into metrics query client),
  name: name of the function,
  type: type of the function
  location: location of the function,
  kind: function of the function (which should be functionapp, or functionapp,linux);
  */

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




  res.locals.metrics = metricsArray;

  return next();
};

// this is a duplicate of what appears in performancecontroller. Only need one of each.
functionMetricsController.generateMetric1D = function (resObj) {
  let metricString = '';
  for (let key in resObj) {
    if (resObj[key] === true) {
      metricString += key + ',';
    }
  }
  return (metricString = metricString.slice(0, metricString.length - 1));
};


export default functionMetricsController;