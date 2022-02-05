import express, {Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import sdkController from './controllers/sdkController.js';
import metricsController from './controllers/metricsController.js';
import tokenController from './controllers/tokenController.js';

// Import routers
import userRoutes from './routes/userRoutes.js';

// Standard express imports.
const app = express();
app.use(express.json());
app.use(cors());
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);
app.use(cookieParser());

// Set listening port to 3000.
const port = 3000;

// Define routes.

app.use('/user', userRoutes);

// Default route: On initial load, serve subscription, resource group, and functionApp data to the front end.
// Object also includes function execution counts for the given time period for all function Apps in each subscription.
app.get('/executionOnly', sdkController.executionOnly, sdkController.fetchSubscriptionIds, sdkController.fetchResourceGroups, sdkController.fetchResources, metricsController.getMSWebMetrics, sdkController.formatExecutions, (req: Request, res: Response) => {
  res.json(res.locals.executionObj);
});

// Secondary route: On selecting a specific function application, get more metrics.
app.post('/getAppDetails', sdkController.setFunctionApp, metricsController.getMSWebMetrics, metricsController.getMSInsightsMetrics, sdkController.formatAppDetail, (req: Request, res: Response) => {
  res.json(res.locals.appDetail);
});

// Tertiary route: Get all of the functions associated with a specific function application.
app.post('/getAllFunctions', sdkController.setResource, tokenController.getToken, sdkController.getAllFunctions, (req: Request, res: Response) => {
  res.json(res.locals.allFunctions);
});

// Quaternary route: Get metrics associated with a specific function within a function application.
app.post('/getSpecificFunction', sdkController.setFunction, metricsController.retrieveFunctionLogs, (req: Request, res: Response) => {
  res.json(res.locals.funcResponse);
})

// DEBUGGING ONLY: Get a list of function applications.
app.get('/getFuncs', sdkController.fetchSubscriptionIds, sdkController.fetchResourceGroups, sdkController.fetchResources, (req: Request, res: Response) => {
  res.json([res.locals.functionApps, res.locals.insights]);
  }
);

// DEBUGGING ONLY: Get application insight data only.
app.get('/applicationInsights', metricsController.applicationInsights, (req: Request, res: Response) => {
  console.log('finished');
});

// DEBUGGING ONLY: Get a list of all metrics that exist for a given function.
app.get('/getMetrics', sdkController.fetchSubscriptionIds, sdkController.fetchResourceGroups, sdkController.fetchResources, metricsController.getMSWebMetrics, (req: Request, res: Response) => {
  console.log('completed getting MS Web metrics');
  console.log(res.locals.metrics);
  res.json(res.locals.webMetrics);
});

// DEBUGGING ONLY: Get a list of all metrics for all function apps.
app.post('/getInsightsOnly', sdkController.setFunctionApp, metricsController.getMSInsightsMetrics, sdkController.formatAppDetail, (req: Request, res: Response) => {
  res.json(res.locals.insightsOnly);
});

// Global error handler.
app.use((err: TypeError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: `Express error handler caught unknown middleware error ${err}`,
    status: 500,
    message: { err: 'An error occurred. Please contact the Opal team.' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ err: 'endpoint requested is not found' });
});

// Make sure server is listening.
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
