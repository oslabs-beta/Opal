//Bytes received per function.
import { DefaultAzureCredential } from '@azure/identity';
import {
  Durations,
  /* Metric, */ MetricsQueryClient,
} from '@azure/monitor-query';
import /** as*/ dotenv from 'dotenv';

dotenv.config();

//If we pass in a metricsResourceId for an individual function we get a BadRequest as a response. Only function apps can be targeted.
// 'RestError: Microsoft.Web/sites/functions is not a supported platform metric namespace, supported ones are Microsoft.AnalysisServices/servers,'
const metricsResourceId = process.env.RESOURCE_ID;

export async function main() {
  const tokenCredential = new DefaultAzureCredential();
  const metricsQueryClient = new MetricsQueryClient(tokenCredential);

  if (!metricsResourceId) {
    throw new Error(
      'RESOURCE_ID must be set in the environment for this sample'
    );
  }
  //This example uses listMetricDefinitions as an iterator. Do some of the other npm modules work in a similar way?
  const iterator = metricsQueryClient.listMetricDefinitions(metricsResourceId);
  const result = await iterator.next();
  const metricNames/*: string[]*/ = [];
  for await (const result of iterator) {
    console.log(` metricDefinitions - ${result.id}, ${result.name}`);
    if (result.name) {
      metricNames.push(result.name);
    }
  }
  console.log("metricNames", metricNames);
  const firstMetricName = /*metricNames[0];*/ 'FunctionExecutionCount';
  const secondMetricName = /*metricNames[1];*/ 'BytesSent';
  if (firstMetricName && secondMetricName) {
    console.log(
      `Picking an example metric to query: ${firstMetricName} and ${secondMetricName}`
    );
    const metricsResponse = await metricsQueryClient.queryResource(
      metricsResourceId,
      [firstMetricName, secondMetricName],
      {
              //supported granularities are: PT1M,PT5M,PT15M,PT30M,PT1H,PT6H,PT12H,P1D,
        granularity: 'PT5M',
        timespan: { duration: /*Durations.fiveMinutes*/'PT25M' },
        // [AggregationType.Average, AggregationType.Maximum] also available for aggregations.
        aggregations: ['Count']
      }
    );

    console.log(
      `Query cost: ${metricsResponse.cost}, interval: ${metricsResponse.granularity}, time span: ${metricsResponse.timespan}`
    );

        // const metrics: Metric[] = metricsResponse.metrics;
    const { metrics } = metricsResponse;
    console.log(`Metrics:`, JSON.stringify(metrics, undefined, 2));
    /*const metric = metricsResponse.getMetricByName(firstMetricName);*/
    // console.log handling taken from responseHandler due to prettier console logs.
    for (const metric of metrics) {
      console.log(metric.name);
      console.log(metric.timeseries[0].data);
      console.log(metric.timeseries);
      for (const timeseriesElement of metric.timeseries) {
        for (const metricValue of timeseriesElement.data /*!*/) {
          if (metricValue.count !== 0) {
            console.log(
              `There are ${metricValue.count} matched events at ${metricValue.timeStamp}`
            );
          }
        }
      }
    }
  } else {
    console.error(
      `Metric names are not defined - ${firstMetricName} and ${secondMetricName}`
    );
  }
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
  process.exit(1);
});
