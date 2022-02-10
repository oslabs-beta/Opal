import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.post(
  // Checks to see if either the username or email are in use and then creates an account if it passes the test
  '/signup',
  userController.checkUserCred,
  userController.addUserCred,
  (req, res) => {
    res.status(200).json({user:res.locals.user, userInfo: res.locals.userInfo});
  }
);

router.post('/login', userController.login, (req, res) => {
  res.status(200).json({user:res.locals.user, userInfo: res.locals.userInfo});
});

export default router;
