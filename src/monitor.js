import { DefaultAzureCredential } from '@azure/identity';
import { Durations, LogsQueryClient, MetricsQueryClient } from '@azure/monitor-query';

const credential = new DefaultAzureCredential();

const logsQueryClient = new LogsQueryClient(credential);
// or
const metricsQueryClient = new MetricsQueryClient(credential);

const workspaceId = 'a04e0408-dfcb-4c75-a063-907e8e73efdd';

// const response = await metricsQueryClient.queryResource(
//     resourceId,
//     metricNames: ["Ingress"],
//     {
//         aggregations: [AggregationType.Average, AggregationType.Maximum]
//     });

const response = await logsQueryClient.queryWorkspace(
  workspaceId,
  'AzureActivity | top 10 by TimeGenerated',
  {
    duration: Durations.oneDay,
  },
);

console.log(response.tables[0].columns[0].type);
