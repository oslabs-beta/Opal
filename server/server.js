// Import statements.
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import performanceController from './controllers/performanceController.js';
import sdkController from './controllers/testsdkcontroller.js';
import functionMetricsController from './controllers/functionMetricsController.js';

// Import routers
import userRoutes from './routes/userRoutes.js';

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
  performanceController.getStorageData,
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
    res.json(res.locals.functionApps);
  }
);

app.get(
  '/getMetrics',
  sdkController.fetchSubscriptionIds,
  sdkController.fetchResourceGroups,
  sdkController.fetchResources,
  functionMetricsController.getMetrics,
  (req, res) => {
    console.log('completed');
    console.log(res.locals.metrics);
    res.json(res.locals.metrics);
  }
);

// Default error handler.
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
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
