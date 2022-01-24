const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();

router.post(
  //checks to see if either the username or email are in use and then creates an account if it passes the test
  '/signup',
  userController.checkUserCred,
  userController.addUserCred,
  (req, res) => {
    res.status(200).json(res.locals.user);
  }
);

router.post('/login', userController.login, (req, res) => {
  res.status(200).json(res.locals.user);
});

module.exports = router;
