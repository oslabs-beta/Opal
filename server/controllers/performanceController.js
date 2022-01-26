// Import statements, and configure dotenv.
import fetch from 'node-fetch';
import { config } from 'dotenv';
import { MSWebSimulator, MSStorageSimulator, MSInsightsSimulator } from '../constants/frontendSimulator.js';
config();

// Set temporary bearer token.
// NOTE: local env file for testing may differ from the one used by express (root directory .env).
const BEARER_TOKEN = process.env.BEARER_TOKEN;

//const clientId = process.env.CLIENT_ID;
//const clientSecret = process.env.CLIENT_SECRET;
//const tenantId = process.env.TENANT_ID;
// Set subscription ID, which is required to use the Azure REST API.
const subscriptionId = process.env.SUBSCRIPTION_ID;

// Set constants for resource group and resource name.
const RESOURCE_GROUP = 'triggertestmogwais';
const RESOURCE = 'triggerTestMogwais';

// Set constant (for now) to identify the relevant timespan.
const TIMESPAN = '2022-01-25T15:00:00Z/2022-01-26T23:59:00Z';

// Set constant (for now) to identify preferred interval. Currently set to every six hours.
const INTERVAL = 'PT6H';

// If needed, filter results.
//const FILTER = '';

const performanceController = {};

performanceController.convertFrontEndToSDK = (req, res, next) => {
  // Need to add error handling to these.
  console.log('entering convert to SDK controller');
  // get requested functions.

  const timeConverter = {
    '1 minute': 'PT1M',
    '5 minutes': 'PT5M',
    '15 minutes': 'PT15M',
    '30 minutes': 'PT30M',
    '1 hour': 'PT1H',
    '6 hours': 'PT6H',
    '12 hours': 'PT12H',
    '1 day': 'PT1D',
  };

  try {
    console.log('converting granularity');
    const funcs = req.body.functions;
    // get requested granularity and timespan
    const granularity = req.body.granularity;
    res.locals.granularity = timeConverter[granularity.toLowerCase()];
  } catch (err) {
    return next({
      err: err,
    });
  }

  try {
    console.log('converting timespan');
    const timespan = req.body.timespan;
    res.locals.timespan = timeConverter[timespan.toLowerCase()];
    res.locals.aggregations = req.body.aggregations;
  } catch (err) {
    return next({
      err: err
    })
  }

  // convert requested metrics to an array for use on the backend.
  console.log('selecting metrics for use on backend');
  try {
    const metrics = req.body.metrics;
    const metricArray = [];
    for (let metric in req.body.metrics) {
      if (metrics.metric === true) {
        metricArray.push(metric);
      }
    }
    res.locals.metrics = metricArray;
  } catch (err) {
    return next({
      err: err
    });
  }

  return next();
};

performanceController.convertSDKToFrontEnd = (req, res, next) => {
  try {
    res.locals.sdkData.forEach((metric) => {
      const { id, name, errorCode, unit, timeseries, description } = metric;
      res.locals.functionMetrics[name] = {
        data: timeseries[0]['data'],
        description: description,
        unit: unit,
        URL: id,
        returned: errorCode,
      }
      // Might not need the URL or returned metrics.
    });
  } catch (err) {
    return next({
      err: err
    });
  }
  return next();
}


// Work on asynchronous function calls: all three can be handled at once, instead of awaiting
// the results of a prior controller's call. Check BPs.

// First route: get data from MS Azure Web API.
performanceController.getWebData = async (req, res, next) => {
  console.log('Fetching data from Microsoft.Web API');
  //console.log(BEARER_TOKEN);
  //console.log(subscriptionId);
  const API_VERSION = '2021-05-01';
  const metricList = performanceController.generateMetric1D(MSWebSimulator);
  try {
    const fetchURL = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${RESOURCE}/providers/microsoft.insights/metrics?metricnames=${metricList}&timespan=${TIMESPAN}&interval=${INTERVAL}&api-version=${API_VERSION}`;
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Authorization: BEARER_TOKEN,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('BEARER TOKEN');
        // console.log(BEARER_TOKEN);
        // console.log('and its type');
        // console.log(typeof BEARER_TOKEN);
        res.locals.webData = data;
        console.log('got web data successfully');
        console.log(data);
        return next();
      });
  } catch (err) {
    console.log('ERROR in web data');
    return next(err);
  }
};

// Second route: get data from MS Insights Web API.
performanceController.getInsightsData = async (req, res, next) => {
  //console.log('Fetching data from the Microsoft.Insights API');
  //console.log(BEARER_TOKEN);
  const API_VERSION = '2021-05-01';
  const metricList = performanceController.generateMetric2D(MSInsightsSimulator);

  try {
    const fetchURL = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Insights/components/${RESOURCE}/providers/microsoft.insights/metrics?metricnames=${metricList}&timespan=${TIMESPAN}&interval=${INTERVAL}&api-version=${API_VERSION}`;
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.locals.insightsData = data;
        console.log('got insights data successfully');
        console.log(data);
        return next();
      });
  } catch (err) {
    console.log('error in getting insights data');
    console.log(err);
    return next();
  }
};

// Third route: get data from storage API.
performanceController.getStorageData = async (req, res, next) => {
  //console.log('Fetching data from Microsoft.Storage API');
  //console.log(BEARER_TOKEN);
  const API_VERSION = '2021-05-01';
  const metricList = performanceController.generateMetric1D(MSStorageSimulator);
  try {
    const fetchURL = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Storage/storageAccounts/${RESOURCE}/providers/microsoft.insights/metrics?metricnames=${metricList}&timespan=${TIMESPAN}&interval=${INTERVAL}&api-version=${API_VERSION}`;
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Authorization: `${BEARER_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.locals.storageData = data;
        console.log('got storage data successfully');
        console.log(data);
        return next();
      });
  } catch (err) {
    console.log('failed to get storage data');
    return next(err);
  }
};

// Consider combining the 1D and 2D object ingestion functions into a single function.
performanceController.generateMetric1D = function (resObj) {
  let metricString = '';
  for (let key in resObj) {
    if (resObj[key] === true) {
      metricString += key + ',';
    }
  }
  return (metricString = metricString.slice(0, metricString.length - 1));
};

// For metric objects that are two levels deep, use this function.
performanceController.generateMetric2D = function (resObj) {
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

// For testing locally without invoking the server.
//performanceController.getStorageData();
//performanceController.getInsightsData();
//performanceController.getWebData();
export default performanceController;
