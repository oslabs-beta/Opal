import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const tokenController = {};

//Import environmental variables.
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

tokenController.getToken = async (req, res, next) => {
  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    return next({
      err: 'Cannot retrieve bearer token: missing environmental variables for service principal.'
    });
  }
  // Unless the user already has a token stored (not yet implemented), get a new token.
  const azureManagementURL = 'https://management.azure.com/';
  const grantType = 'client_credentials';
  const url = 'https://login.microsoftonline.com/' + TENANT_ID + '/oauth2/token';
  await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=${grantType}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&resource=${azureManagementURL}`,
  })
    .then((response) => response.json())
    .then((data) => {
      // If res.locals.azure has not yet been set, create it.
      if (!res.locals.azure) res.locals.azure = {};
      res.locals.azure.bearerToken = {
        token: data.access_token,
        expires: data.expires_on,
        not_before: data.not_before,
      };
      return next();
    });
};

export default tokenController;
