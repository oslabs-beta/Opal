// Decide whether to use fetch or axios consistently across controllers.
import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const tokenController = {};

// If need to change login functionality, need these to be defined elsewhere.
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

tokenController.checkToken = async (req, res, next) => {
  // Consider adding route to temporarily store bearer tokens.
};

tokenController.getToken = async (req, res, next) => {
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
