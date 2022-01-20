// Import statements.
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import controllers.

// Standard imports.
const app = express();
app.use(express.json());
//const router = express.Router();
app.use(cookieParser());

// Set port to 3000.
const port = 3000;

// BASE route
app.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Serve static files (css, js).
// app.use(express.static) should set content type of css and js files automatically.
app.use(express.static(path.resolve(__dirname, '../assets/')));

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

// Make sure server is listening.
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
