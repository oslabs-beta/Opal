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

/*
// 20220125205245
// http://localhost:3000/getMetrics

[
  {
    "cost": 17274,
    "namespace": "Microsoft.Web/sites",
    "metrics": [
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Web/sites/triggerTestMogwais/providers/Microsoft.Insights/metrics/BytesReceived",
        "type": "Microsoft.Insights/metrics",
        "name": "BytesReceived",
        "errorCode": "Success",
        "unit": "Bytes",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 87705
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 387120
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "The amount of incoming bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Web/sites/triggerTestMogwais/providers/Microsoft.Insights/metrics/BytesSent",
        "type": "Microsoft.Insights/metrics",
        "name": "BytesSent",
        "errorCode": "Success",
        "unit": "Bytes",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 43394
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 148653
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "The amount of outgoing bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Web/sites/triggerTestMogwais/providers/Microsoft.Insights/metrics/FunctionExecutionUnits",
        "type": "Microsoft.Insights/metrics",
        "name": "FunctionExecutionUnits",
        "errorCode": "Success",
        "unit": "Count",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 513280
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 2236032
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "Function Execution Units. For FunctionApps only."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Web/sites/triggerTestMogwais/providers/Microsoft.Insights/metrics/FunctionExecutionCount",
        "type": "Microsoft.Insights/metrics",
        "name": "FunctionExecutionCount",
        "errorCode": "Success",
        "unit": "Count",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 39
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 82
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "Function Execution Count. For FunctionApps only."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Web/sites/triggerTestMogwais/providers/Microsoft.Insights/metrics/Threads",
        "type": "Microsoft.Insights/metrics",
        "name": "Threads",
        "errorCode": "Success",
        "unit": "Count",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 11066
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 30083
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "The number of threads currently active in the app process. For WebApps and FunctionApps."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwais/providers/Microsoft.Web/sites/triggerTestMogwais/providers/Microsoft.Insights/metrics/FileSystemUsage",
        "type": "Microsoft.Insights/metrics",
        "name": "FileSystemUsage",
        "errorCode": "Success",
        "unit": "Bytes",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 0
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "Percentage of filesystem quota consumed by the app. For WebApps and FunctionApps."
      }
    ],
    "timespan": {
      "startTime": "2022-01-24T01:51:44.000Z"
    },
    "resourceRegion": "eastus",
    "granularity": "PT6H"
  },
  {
    "cost": 17274,
    "namespace": "Microsoft.Web/sites",
    "metrics": [
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/Microsoft.Web/sites/test2app1/providers/Microsoft.Insights/metrics/BytesReceived",
        "type": "Microsoft.Insights/metrics",
        "name": "BytesReceived",
        "errorCode": "Success",
        "unit": "Bytes",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z"
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z"
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "The amount of incoming bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/Microsoft.Web/sites/test2app1/providers/Microsoft.Insights/metrics/BytesSent",
        "type": "Microsoft.Insights/metrics",
        "name": "BytesSent",
        "errorCode": "Success",
        "unit": "Bytes",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 0
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "The amount of outgoing bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/Microsoft.Web/sites/test2app1/providers/Microsoft.Insights/metrics/FunctionExecutionUnits",
        "type": "Microsoft.Insights/metrics",
        "name": "FunctionExecutionUnits",
        "errorCode": "Success",
        "unit": "Count",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 0
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "Function Execution Units. For FunctionApps only."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/Microsoft.Web/sites/test2app1/providers/Microsoft.Insights/metrics/FunctionExecutionCount",
        "type": "Microsoft.Insights/metrics",
        "name": "FunctionExecutionCount",
        "errorCode": "Success",
        "unit": "Count",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 0
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "Function Execution Count. For FunctionApps only."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/Microsoft.Web/sites/test2app1/providers/Microsoft.Insights/metrics/Threads",
        "type": "Microsoft.Insights/metrics",
        "name": "Threads",
        "errorCode": "Success",
        "unit": "Count",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 0
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "The number of threads currently active in the app process. For WebApps and FunctionApps."
      },
      {
        "id": "/subscriptions/eb87b3ba-9c9c-4950-aa5d-6e60e18877ad/resourceGroups/triggertestmogwai2/providers/Microsoft.Web/sites/test2app1/providers/Microsoft.Insights/metrics/FileSystemUsage",
        "type": "Microsoft.Insights/metrics",
        "name": "FileSystemUsage",
        "errorCode": "Success",
        "unit": "Bytes",
        "timeseries": [
          {
            "data": [
              {
                "timeStamp": "2022-01-24T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T13:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-24T19:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T01:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T07:51:00.000Z",
                "total": 0
              },
              {
                "timeStamp": "2022-01-25T13:51:00.000Z",
                "total": 4096
              },
              {
                "timeStamp": "2022-01-25T19:51:00.000Z",
                "total": 4096
              }
            ],
            "metadataValues": [

            ]
          }
        ],
        "description": "Percentage of filesystem quota consumed by the app. For WebApps and FunctionApps."
      }
    ],
    "timespan": {
      "startTime": "2022-01-24T01:51:44.000Z"
    },
    "resourceRegion": "eastus",
    "granularity": "PT6H"
  }
]
*/

export default functionMetricsController;