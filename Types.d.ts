export interface GraphInterface {}

export interface getExecOnlyData {
  [key: string]: {
    [key: string]: {
      [key: string]: {};
    };
  };
}

interface TSdata {
  timeStamp: string;
  total: number;
}

export interface FunctionApp {
  id: string;
  insightId: string;
  location: string;
  metricName: string;
  name: string;
  resourceGroupId: string;
  resourceGroupName: string;
  subscriptionDisplayName: string;
  subscriptionId: string;
  subscriptionNamespaceId: string;
  tenantId: string;
  timeseries: [TSdata];
  totalCount: number;
}

interface refObj extends HTMLInputElement {
  current: {
    value: string;
  };
  value: string;
}
