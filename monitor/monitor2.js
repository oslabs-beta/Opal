//Bytes received.
import { DefaultAzureCredential } from '@azure/identity';
import {
  Durations,
  /* Metric, */ MetricsQueryClient,
} from '@azure/monitor-query';
import /** as*/ dotenv from 'dotenv';

dotenv.config();

const metricsResourceId = process.env.RESOURCE_ID;

export async function main() {
  const tokenCredential = new DefaultAzureCredential();
  const metricsQueryClient = new MetricsQueryClient(tokenCredential);

  if (!metricsResourceId) {
    throw new Error(
      'METRICS_RESOURCE_ID must be set in the environment for this sample'
    );
  }
  const iterator = metricsQueryClient.listMetricDefinitions(metricsResourceId);
  const result = await iterator.next();
  const metricNames/*: string[]*/ = [];
  for await (const result of iterator) {
    console.log(` metricDefinitions - ${result.id}, ${result.name}`);
    if (result.name) {
      metricNames.push(result.name);
    }
  }
  const firstMetricName = metricNames[0];
  const secondMetricName = metricNames[1];
  if (firstMetricName && secondMetricName) {
    console.log(
      `Picking an example metric to query: ${firstMetricName} and ${secondMetricName}`
    );
    const metricsResponse = await metricsQueryClient.queryResource(
      metricsResourceId,
      [firstMetricName, secondMetricName],
      {
        granularity: 'PT1M',
        timespan: { duration: Durations.fiveMinutes },
      }
    );

    console.log(
      `Query cost: ${metricsResponse.cost}, interval: ${metricsResponse.granularity}, time span: ${metricsResponse.timespan}`
    );

        // const metrics: Metric[] = metricsResponse.metrics;
    const { metrics } = metricsResponse;
    console.log(`Metrics:`, JSON.stringify(metrics, undefined, 2));
    const metric = metricsResponse.getMetricByName(firstMetricName);
    console.log(
      `Selected Metric: ${firstMetricName}`,
      JSON.stringify(metric, undefined, 2)
    );
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
