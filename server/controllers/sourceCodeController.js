import { config } from 'dotenv';
import { DefaultAzureCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import { SubscriptionClient } from '@azure/arm-resources-subscriptions';
import { OperationalInsightsManagementClient } from '@azure/arm-operationalinsights';
import fetch from 'node-fetch';
import axios from 'axios'
config();

const sourceCodeController = {};

sourceCodeController.getCode = async (req, res, next) => {
  console.log('token');
  console.log(res.locals.azure.bearerToken.token);
  if (!res.locals.azure) res.locals.azure = {};
  let url = `https://FunctionApp727.scm.azurewebsites.net/api/zip/site/wwwroot/`;
  res.locals.azure.code = axios(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + res.locals.azure.bearerToken.token,
    },
  })
  .then(() => {
    return next()
  }).catch((err) => {
    console.log(err);
    return next({err});
  });
  console.log(res.locals.azure.code);
}


export default sourceCodeController;