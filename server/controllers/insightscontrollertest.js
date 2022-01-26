import { config } from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import { Durations, MetricsQueryClient } from '@azure/monitor-query';
import { SubscriptionClient } from '@azure/arm-resources-subscriptions';
import { MSInsightsSimulator, MSStorageSimulator, MSWebSimulator } from '../constants/frontendSimulator.js';
config();

const insightsController = {};

// TEMPORARY ONLY
const tempInsightResources = [
  {
    id: '/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Insights/components/triggertestmogwais',
    name: 'triggertestmogwais',
    type: 'Microsoft.Insights/components',
    location: 'eastus',
    tags: {},
    kind: 'web',
  },
    {
      id: '/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/microsoft.insights/components/test2app1',
      name: 'test2app1',
      type: 'microsoft.insights/components',
      location: 'eastus',
      tags: {},
      kind: 'web'
      },
];

insightsController.getInsights = async (req, res, next) => {
  const credential = new DefaultAzureCredential();
  const metricQuery = new MetricsQueryClient(credential);
  const metrics = insightsController.generateMetric2D(MSInsightsSimulator);
  const metricsArray = [];
  // Alma: Replacing temp with actual resource IDs.
  for await (let resource of res.locals.functionApps) {
    const resId = resource.insightId
    if (!resId) {
      return next({
        err: 'Resource ID must be set to fetch metrics for function.',
      });
    }
    const result = await metricQuery.queryResource(resId, metrics, {
      //granularity: 'PT6H',
      //timespan: {duration: 'PT48H'},
      //aggregations: ['Count']
    });
    metricsArray.push(result);
  }
  res.locals.insightsMetrics = metricsArray;
  // Added this line as well.
  console.log(res.locals.insightsMetrics);
  return next();
};

insightsController.generateMetric2D = function (resObj) {
  //let metricString = '';
  let metricArray = [];
  for (let keyTopLevel in resObj) {
    for (let keyBottomLevel in resObj[keyTopLevel]) {
      if (resObj[keyTopLevel][keyBottomLevel] === true) {
        metricArray.push(keyTopLevel + '/' + keyBottomLevel);
      }
    }
  }
  return metricArray;
};

export default insightsController;
