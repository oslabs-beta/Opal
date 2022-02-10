//Logs but not what we are looking for.
import { DefaultAzureCredential } from '@azure/identity';
import {
  Durations,
  LogsQueryClient,
  MetricsQueryClient,
} from '@azure/monitor-query';

import dotenv from 'dotenv';

dotenv.config();

const credential = new DefaultAzureCredential();

const logsQueryClient = new LogsQueryClient(credential);
// or
const metricsQueryClient = new MetricsQueryClient(credential);

const workspaceId = process.env.WORKSPACE_ID;

const resourceId = process.env.RESOURCE_ID;

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

console.log(response);
console.log(response.tables[0].columns[0]);
