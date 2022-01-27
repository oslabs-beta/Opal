// Import statements.
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import performanceController from './controllers/performanceController.js';
import sdkController from './controllers/testsdkcontroller.js';
import functionMetricsController from './controllers/functionMetricsController.js';
import insightsController from './controllers/insightscontrollertest.js';

// Import routers
import userRoutes from './routes/userRoutes.js';
// import performanceController from './controllers/performanceController.js';

// Standard imports.
const app = express();
app.use(express.json());
app.use(cors());
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

app.use(cookieParser());

// Set listening port to 3000.
const port = 3000;

//define router handlers
app.use('/user', userRoutes);

// Route for retrieving standard metrics on homepage.
app.get(
  '/baseMetrics',
  performanceController.getWebData,
  performanceController.getInsightsData,
  /*performanceController.getStorageData,*/
  (req, res) => {
    // Three controllers are used to retrieve metrics from 3 APIs. Response object will contain three sub-objects.
    res.locals.baseMetrics = {
      storage: res.locals.webData,
      web: res.locals.storageData,
      insights: res.locals.insightsData,
    };
    res.status(200);
    res.json(res.locals.baseMetrics);
  }
);

app.get(
  '/getFuncs',
  sdkController.fetchSubscriptionIds,
  sdkController.fetchResourceGroups,
  sdkController.fetchResources,
  (req, res) => {
    //console.log('this is back on the frontend');
    //console.log(res.locals.subscriptions);
    //res.json(res.locals.subscriptions);
    res.json([res.locals.functionApps, res.locals.insights]);
    // res.json(res.locals.insightsList);
  }
);

app.get(
  '/getMetrics',
  sdkController.fetchSubscriptionIds,
  sdkController.fetchResourceGroups,
  sdkController.fetchResources,
  functionMetricsController.getMSWebMetrics,
  (req, res) => {
    console.log('completed getting MS Web metrics');
    console.log(res.locals.metrics);
    // Need to combine into a JSON object.
    res.json(res.locals.webMetrics);
  }
);

app.get(
  '/getInsights',
  sdkController.fetchSubscriptionIds,
  sdkController.fetchResourceGroups,
  sdkController.fetchResources,
  insightsController.getInsights,
  (req, res) => {
    console.log('completed getting application insights metrics');
    res.json(res.locals.insightsMetrics);
  }
);

app.get(
  '/executionOnly',
  sdkController.executionOnly,
  sdkController.fetchSubscriptionIds,
  sdkController.fetchResourceGroups,
  sdkController.fetchResources,
  functionMetricsController.getMSWebMetrics,
  sdkController.formatExecutions,
  (req, res) => {
    res.json(res.locals.executionObj);
  }
);

app.post(
  '/getAppDetails',
  sdkController.setFunctionApp,
  functionMetricsController.getMSWebMetrics,
  functionMetricsController.getMSInsightsMetrics,
  sdkController.formatAppDetail,
  (req, res) => {
    res.json(res.locals.appDetail);
  }
);

// Global error handler.

app.use((err, req, res, next) => {
  const defaultErr = {
    log: `Express error handler caught unknown middleware error ${err}`,
    status: 500,
    message: { err: 'An error occurred. Please contact the Opal team.' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.use('*', (req, res) => {
  res.status(404).json({ err: 'endpoint requested is not found' });
});

// Make sure server is listening.
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
