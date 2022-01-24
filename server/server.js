// Import statements.
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

// Import routers
const userRoutes = require('./routes/userRoutes.js');

// Standard imports.
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Set port to 3000.
const port = 3000;

//define router handlers
app.use('/user', userRoutes);

// Serve static files (css, js).
// app.use(express.static) should set content type of css and js files automatically.
app.use(express.static(path.resolve(__dirname, '../assets')));

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
