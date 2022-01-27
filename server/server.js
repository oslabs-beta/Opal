// Import statements.
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import sdkController from './controllers/testsdkcontroller.js';
import functionMetricsController from './controllers/functionmetricscontroller.js'

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

// For debugging: get list of all functions.
app.get('/getFuncs', sdkController.fetchSubscriptionIds, sdkController.fetchResourceGroups, sdkController.fetchResources, (req, res) => {
  res.json([res.locals.functionApps, res.locals.insights]);
  }
);

// For debugging: get list of ALL metrics for all functions.
app.get('/getMetrics', sdkController.fetchSubscriptionIds, sdkController.fetchResourceGroups, sdkController.fetchResources, functionMetricsController.getMSWebMetrics, (req, res) => {
  console.log('completed getting MS Web metrics');
  console.log(res.locals.metrics);
  res.json(res.locals.webMetrics);
});

// Default route to serve up the frontend upon load.
app.get('/executionOnly', sdkController.executionOnly, sdkController.fetchSubscriptionIds, sdkController.fetchResourceGroups, sdkController.fetchResources, functionMetricsController.getMSWebMetrics, sdkController.formatExecutions, (req, res) => {

  res.json(res.locals.executionObj);
});

// Get more metrics about a specific app.
app.post('/getAppDetails', sdkController.setFunctionApp, functionMetricsController.getMSWebMetrics, functionMetricsController.getMSInsightsMetrics, sdkController.formatAppDetail, (req, res) => {
  res.json(res.locals.appDetail);
});

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
