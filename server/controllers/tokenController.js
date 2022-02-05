import fetch from 'node-fetch';
import { config } from 'dotenv';
//import { Request, Response, NextFunction } from 'express';
config();

// Reset type for controllers.
const tokenController: any = {};

// If need to change login functionality, need these to be defined elsewhere.
// See if better way to handle environmental variables in this context.
const TENANT_ID: any = process.env.TENANT_ID;
const CLIENT_ID: any = process.env.CLIENT_ID;
const CLIENT_SECRET: any = process.env.CLIENT_SECRET;

tokenController.checkToken = async (req, res, next) => {
  // Consider adding route if storing token in cookie or elsewhere until expiration.
};

tokenController.getToken = async (req, res, next) => {
  // (Unless user has a token stored), get a new token.
  const azureManagementURL: string = 'https://management.azure.com/';
  const grantType: string = 'client_credentials';
  const url: string = 'https://login.microsoftonline.com/' + TENANT_ID + '/oauth2/token';
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
      console.log('Access token retrieved successfully.');
      res.locals.azure.bearerToken = {
        token: data.access_token,
        expires: data.expires_on,
        not_before: data.not_before,
      };
      return next();
    });
};

export default tokenController;
