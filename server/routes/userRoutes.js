import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.post(
  // Checks to see if either the username or email are in use and then creates an account if it passes the test
  '/signup',
  userController.checkUserCred,
  userController.addUserCred,
  (req, res) => {
    res
      .status(200)
      .json({ user: res.locals.user, userInfo: res.locals.userInfo });
  }
);

router.post('/login', userController.login, (req, res) => {
  res
    .status(200)
    .json({ user: res.locals.user, userInfo: res.locals.userInfo });
});

router.put('/update', userController.update, (req, res) => {
  res
    .status(200)
    .send({ mess: 'Account updated!', userInfo: res.locals.updatedUser });
});

// router.get('/sendBack', userController.sendBack, (req, res) => {
//   res.status(200).json({ user: res.locals.users });
// });

export default router;
