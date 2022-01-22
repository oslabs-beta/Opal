// Function Execution Count for FunctionApp. Can also be used for any other metrics in the Microsoft.Web/sites namespace
import { DefaultAzureCredential } from '@azure/identity';
import {
  Durations,
  /* Metric, */ MetricsQueryClient,
} from '@azure/monitor-query';
import /** as*/ dotenv from 'dotenv';

dotenv.config();

const metricsResourceId =
  process.env.RESOURCE_ID_PER_FUNCTION;

  console.log("metricsResourceId", metricsResourceId);

export async function main() {
  const tokenCredential = new DefaultAzureCredential();
  const metricsQueryClient = new MetricsQueryClient(tokenCredential);

  if (!metricsResourceId) {
    throw new Error(
      'METRICS_RESOURCE_ID for an Azure Metrics Advisor subscription must be set in the environment for this sample'
    );
  }

  const event = 'FunctionExecutionCount';
  console.log(`Picking an example metric to query: ${event}`);

  const metricsResponse = await metricsQueryClient.queryResource(
    metricsResourceId,
    [event],
    {
      timespan: {
        duration: Durations.fiveMinutes,
      },
      granularity: 'PT1M',
      aggregations: ['Count'],
    }
  );

  console.log(
    `Query cost: ${metricsResponse.cost}, granularity: ${metricsResponse.granularity}, time span: ${metricsResponse.timespan}`
  );

  console.log(metricsResponse.timespan);

  const metrics /*: Metric[] */ = metricsResponse.metrics;
  console.log(metrics);
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
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
  process.exit(1);
});
