import { config } from 'dotenv';
import axios from 'axios'
config();

const sourceCodeController = {};

// In development: retrieve source code for a given function.
sourceCodeController.getCode = async (req, res, next) => {
  if (!res.locals.azure) res.locals.azure = {};
  let NAME = '';
  let url = `https://${NAME}.scm.azurewebsites.net/api/zip/site/wwwroot/`;
  res.locals.azure.code = axios(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + res.locals.azure.bearerToken.token,
    },
  })
  .then(() => {
    return next()
  }).catch((err) => {
    return next({err});
  });
}

export default sourceCodeController;