import { DefaultAzureCredential } from '@azure/identity';
import {
  Durations,
  LogsQueryClient,
  MetricsQueryClient,
} from '@azure/monitor-query';

const credential = new DefaultAzureCredential();

const logsQueryClient = new LogsQueryClient(credential);
// or
const metricsQueryClient = new MetricsQueryClient(credential);

const workspaceId = 'a04e0408-dfcb-4c75-a063-907e8e73efdd';

const resourceId =
  '/subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2';

// const response = await metricsQueryClient.queryResource(
//     resourceId,
//     metricNames: ["Ingress"],
//     {
//         aggregations: [AggregationType.Average, AggregationType.Maximum]
//     });

// console.log(response);

const response = await logsQueryClient.queryWorkspace(
  workspaceId,
  'AzureActivity | top 10 by TimeGenerated',
  {
    duration: Durations.oneDay,
  }
);

console.log(response /* .tables[0].columns[0].type */);
