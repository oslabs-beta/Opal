// Import statements, and configure dotenv.
import fetch from 'node-fetch';
import {config} from 'dotenv';
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
const TIMESPAN = '2022-01-19T00:00:00Z/2022-01-20T23:59:00Z';

// Set constant (for now) to identify preferred interval. Currently set to every six hours.
const INTERVAL = 'PT6H';

// If needed, filter results.
//const FILTER = '';

const performanceController = {};

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
    // console.log('BEARER_TOKEN');
    // console.log(typeof BEARER_TOKEN);
    // console.log(BEARER_TOKEN);
    // console.log('BEARER_CLONE');
    // console.log(typeof BEARER_CLONE);
    // console.log(BEARER_CLONE);
    // console.log('are their values the same');
    // console.log(BEARER_TOKEN === BEARER_CLONE);
    const fetchURL = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${RESOURCE}/providers/microsoft.insights/metrics?metricnames=${metricList}&timespan=${TIMESPAN}&interval=${INTERVAL}&api-version=${API_VERSION}`;
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Authorization: BEARER_TOKEN
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
