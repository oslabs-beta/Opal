import { DefaultAzureCredential } from "@azure/identity";
import { Durations, /* Metric,*/ MetricsQueryClient } from "@azure/monitor-query";
import * as dotenv from "dotenv";

dotenv.config();

const metricsResourceId = '/subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2';

export async function main() {
  const tokenCredential = new DefaultAzureCredential();
  const metricsQueryClient = new MetricsQueryClient(tokenCredential);

  if (!metricsResourceId) {
    throw new Error("METRICS_RESOURCE_ID must be set in the environment for this sample");
  }

  const iterator = metricsQueryClient.listMetricDefinitions(metricsResourceId);
  let result = await iterator.next();
  let metricNames = [];
  for await (const result of iterator) {
    console.log(` metricDefinitions - ${result.id}, ${result.name}`);
    if (result.name) {
      metricNames.push(result.name);
    }
  }
  const firstMetricName = metricNames[0];
  const secondMetricName = metricNames[1];
  if (firstMetricName && secondMetricName) {
    console.log(`Picking an example metric to query: ${firstMetricName} and ${secondMetricName}`);
    const metricsResponse = await metricsQueryClient.queryResource(
      metricsResourceId,
      [firstMetricName, secondMetricName],
      {
        granularity: "PT1M",
        timespan: { duration: Durations.fiveMinutes }
      }
    );

    console.log(
      `Query cost: ${metricsResponse.cost}, interval: ${metricsResponse.granularity}, time span: ${metricsResponse.timespan}`
    );

    const metrics = metricsResponse.metrics;
    console.log(`Metrics:`, JSON.stringify(metrics, undefined, 2));
    const metric = metricsResponse.getMetricByName(firstMetricName);
    console.log(`Selected Metric: ${firstMetricName}`, JSON.stringify(metric, undefined, 2));
  } else {
    console.error(`Metric names are not defined - ${firstMetricName} and ${secondMetricName}`);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
  process.exit(1);
});