//From executing responseHandler.js 19 Jan 2022
Picking an example metric to query: MatchedEventCount
The sample encountered an error: RestError: Failed to find metric configuration for provider: Microsoft.Web, resource Type: sites, metric: MatchedEventCount, Valid metrics: Requests,BytesReceived,BytesSent,Http101,Http2xx,Http3xx,Http401,Http403,Http404,Http406,Http4xx,Http5xx,MemoryWorkingSet,AverageMemoryWorkingSet,AverageResponseTime,HttpResponseTime,FunctionExecutionUnits,FunctionExecutionCount,AppConnections,Handles,Threads,PrivateBytes,IoReadBytesPerSecond,IoWriteBytesPerSecond,IoOtherBytesPerSecond,IoReadOperationsPerSecond,IoWriteOperationsPerSecond,IoOtherOperationsPerSecond,RequestsInApplicationQueue,CurrentAssemblies,TotalAppDomains,TotalAppDomainsUnloaded,Gen0Collections,Gen1Collections,Gen2Collections,HealthCheckStatus,FileSystemUsage 
 {
  "name": "RestError",
  "code": "BadRequest",
  "statusCode": 400,
  "request": {
    "url": "https://management.azure.com//subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/Microsoft.Insights/metrics?timespan=REDACTED&interval=REDACTED&metricnames=REDACTED&aggregation=REDACTED&api-version=2018-01-01",
    "headers": {
      "accept": "application/json",
      "accept-encoding": "gzip,deflate",
      "user-agent": "azsdk-js-monitor-query/1.0.0 azsdk-js-monitor-metrics/1.0.0 core-rest-pipeline/1.3.3 Node/v16.13.1 OS/(x64-Linux-3.10.0-1160.49.1.el7.x86_64)",
      "x-ms-client-request-id": "ef3a35cd-93b8-492e-a355-3dfe1b19af3c",
      "authorization": "REDACTED"
    },
    "method": "GET",
    "timeout": 0,
    "disableKeepAlive": false,
    "streamResponseStatusCodes": {},
    "withCredentials": false,
    "requestId": "ef3a35cd-93b8-492e-a355-3dfe1b19af3c",
    "allowInsecureConnection": false
  },
  "details": {
    "code": "BadRequest",
    "message": "Failed to find metric configuration for provider: Microsoft.Web, resource Type: sites, metric: MatchedEventCount, Valid metrics: Requests,BytesReceived,BytesSent,Http101,Http2xx,Http3xx,Http401,Http403,Http404,Http406,Http4xx,Http5xx,MemoryWorkingSet,AverageMemoryWorkingSet,AverageResponseTime,HttpResponseTime,FunctionExecutionUnits,FunctionExecutionCount,AppConnections,Handles,Threads,PrivateBytes,IoReadBytesPerSecond,IoWriteBytesPerSecond,IoOtherBytesPerSecond,IoReadOperationsPerSecond,IoWriteOperationsPerSecond,IoOtherOperationsPerSecond,RequestsInApplicationQueue,CurrentAssemblies,TotalAppDomains,TotalAppDomainsUnloaded,Gen0Collections,Gen1Collections,Gen2Collections,HealthCheckStatus,FileSystemUsage"
  },
  "message": "Failed to find metric configuration for provider: Microsoft.Web, resource Type: sites, metric: MatchedEventCount, Valid metrics: Requests,BytesReceived,BytesSent,Http101,Http2xx,Http3xx,Http401,Http403,Http404,Http406,Http4xx,Http5xx,MemoryWorkingSet,AverageMemoryWorkingSet,AverageResponseTime,HttpResponseTime,FunctionExecutionUnits,FunctionExecutionCount,AppConnections,Handles,Threads,PrivateBytes,IoReadBytesPerSecond,IoWriteBytesPerSecond,IoOtherBytesPerSecond,IoReadOperationsPerSecond,IoWriteOperationsPerSecond,IoOtherOperationsPerSecond,RequestsInApplicationQueue,CurrentAssemblies,TotalAppDomains,TotalAppDomainsUnloaded,Gen0Collections,Gen1Collections,Gen2Collections,HealthCheckStatus,FileSystemUsage"
}


//This is the response you can expect from responseHandler after a couple of minutes from executing the function. 19 Jan 2022
Picking an example metric to query: FunctionExecutionCount
Query cost: 4, granularity: PT1M, time span: [object Object]
{ startTime: 2022-01-19T20:21:27.000Z, duration: undefined }
[
  {
    id: '/subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/Microsoft.Insights/metrics/FunctionExecutionCount',
    type: 'Microsoft.Insights/metrics',
    name: 'FunctionExecutionCount',
    errorCode: 'Success',
    unit: 'Count',
    timeseries: [ [Object] ],
    description: 'Function Execution Count. For FunctionApps only.'
  }
]
FunctionExecutionCount
[
  { timeStamp: 2022-01-19T20:21:00.000Z, count: 0 },
  { timeStamp: 2022-01-19T20:22:00.000Z, count: 0 },
  { timeStamp: 2022-01-19T20:23:00.000Z, count: 0 },
  { timeStamp: 2022-01-19T20:24:00.000Z, count: 0 },
  { timeStamp: 2022-01-19T20:25:00.000Z, count: 1 }
]
[
  {
    data: [ [Object], [Object], [Object], [Object], [Object] ],
    metadataValues: []
  }
]
There are 1 matched events at Wed Jan 19 2022 12:25:00 GMT-0800 (Pacific Standard Time)

//From monitor.js 19 Jan 2022
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/BytesReceived, BytesReceived
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/BytesSent, BytesSent
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http101, Http101
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http2xx, Http2xx
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http3xx, Http3xx
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http401, Http401
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http403, Http403
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http404, Http404
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http406, Http406
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http4xx, Http4xx
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Http5xx, Http5xx
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/MemoryWorkingSet, MemoryWorkingSet
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/AverageMemoryWorkingSet, AverageMemoryWorkingSet
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/AverageResponseTime, AverageResponseTime
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/HttpResponseTime, HttpResponseTime
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/FunctionExecutionUnits, FunctionExecutionUnits
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/FunctionExecutionCount, FunctionExecutionCount
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/AppConnections, AppConnections
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Handles, Handles
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Threads, Threads
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/PrivateBytes, PrivateBytes
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/IoReadBytesPerSecond, IoReadBytesPerSecond
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/IoWriteBytesPerSecond, IoWriteBytesPerSecond
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/IoOtherBytesPerSecond, IoOtherBytesPerSecond
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/IoReadOperationsPerSecond, IoReadOperationsPerSecond
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/IoWriteOperationsPerSecond, IoWriteOperationsPerSecond
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/IoOtherOperationsPerSecond, IoOtherOperationsPerSecond
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/RequestsInApplicationQueue, RequestsInApplicationQueue
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/CurrentAssemblies, CurrentAssemblies
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/TotalAppDomains, TotalAppDomains
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/TotalAppDomainsUnloaded, TotalAppDomainsUnloaded
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Gen0Collections, Gen0Collections
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Gen1Collections, Gen1Collections
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/Gen2Collections, Gen2Collections
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/HealthCheckStatus, HealthCheckStatus
 metricDefinitions - /subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/microsoft.insights/metricdefinitions/FileSystemUsage, FileSystemUsage
Picking an example metric to query: BytesReceived and BytesSent
Query cost: 8, interval: PT1M, time span: [object Object]
Metrics: [
  {
    "id": "/subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/Microsoft.Insights/metrics/BytesReceived",
    "type": "Microsoft.Insights/metrics",
    "name": "BytesReceived",
    "errorCode": "Success",
    "unit": "Bytes",
    "timeseries": [
      {
        "data": [
          {
            "timeStamp": "2022-01-19T20:47:00.000Z",
            "total": 396
          },
          {
            "timeStamp": "2022-01-19T20:48:00.000Z"
          },
          {
            "timeStamp": "2022-01-19T20:49:00.000Z",
            "total": 5692
          },
          {
            "timeStamp": "2022-01-19T20:50:00.000Z"
          },
          {
            "timeStamp": "2022-01-19T20:51:00.000Z"
          }
        ],
        "metadataValues": []
      }
    ],
    "description": "The amount of incoming bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
  },
  {
    "id": "/subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/Microsoft.Insights/metrics/BytesSent",
    "type": "Microsoft.Insights/metrics",
    "name": "BytesSent",
    "errorCode": "Success",
    "unit": "Bytes",
    "timeseries": [
      {
        "data": [
          {
            "timeStamp": "2022-01-19T20:47:00.000Z",
            "total": 1158
          },
          {
            "timeStamp": "2022-01-19T20:48:00.000Z",
            "total": 0
          },
          {
            "timeStamp": "2022-01-19T20:49:00.000Z",
            "total": 244
          },
          {
            "timeStamp": "2022-01-19T20:50:00.000Z",
            "total": 0
          },
          {
            "timeStamp": "2022-01-19T20:51:00.000Z",
            "total": 0
          }
        ],
        "metadataValues": []
      }
    ],
    "description": "The amount of outgoing bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
  }
]
Selected Metric: BytesReceived {
  "id": "/subscriptions/4693f16d-2d8c-429a-b738-1ccf85469450/resourceGroups/mogwai2/providers/Microsoft.Web/sites/mogwai2/providers/Microsoft.Insights/metrics/BytesReceived",
  "type": "Microsoft.Insights/metrics",
  "name": "BytesReceived",
  "errorCode": "Success",
  "unit": "Bytes",
  "timeseries": [
    {
      "data": [
        {
          "timeStamp": "2022-01-19T20:47:00.000Z",
          "total": 396
        },
        {
          "timeStamp": "2022-01-19T20:48:00.000Z"
        },
        {
          "timeStamp": "2022-01-19T20:49:00.000Z",
          "total": 5692
        },
        {
          "timeStamp": "2022-01-19T20:50:00.000Z"
        },
        {
          "timeStamp": "2022-01-19T20:51:00.000Z"
        }
      ],
      "metadataValues": []
    }
  ],
  "description": "The amount of incoming bandwidth consumed by the app, in MiB. For WebApps and FunctionApps."
}