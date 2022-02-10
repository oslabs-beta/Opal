import db from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

const userController = {};

userController.checkUserCred = async (req, res, next) => {
  const { Username, Email } = req.body;

  const q = 'SELECT * FROM users WHERE Username = $1 OR Email = $2';
  try {
    const response = await db.query(q, [Username, Email]);
    if (response.rows.length > 0) {
      return next({
        message: {
          msg: 'The username or email is already in use',
          errors: { email: true, username: true },
          error: true,
        },
        status: 409,
      });
    }
  } catch (err) {
    console.log(err);
  }

  return next();
};

userController.addUserCred = async (req, res, next) => {
  const { Username, Email, FirstName, LastName, Password } = req.body;

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(Password, salt);

  const q =
    'INSERT INTO users (username, email, firstName, lastName, password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  await db.query(
    q,
    [Username, Email, FirstName, LastName, hash],
    (err, result) => {
      if (err) {
        console.log('this is the error being triggered', err);
        return next({
          message: {
            msg: 'The username or email is already in use',
            errors: { email: true, username: true },
            error: true,
          },
          status: 400,
        });
      } else {
        if (result.rows.length < 0) {
          return next({
            message: {
              msg: 'There was an error creating your account',
              errors: { all: true },
              error: true,
            },
            status: 400,
          });
        }
        console.log(result);
        res.locals.user = true;
        res.locals.userInfo = result.rows[0];
        return next();
      }
    }
  );
};

userController.login = async (req, res, next) => {
  const { User, Password } = req.body;

  const q = 'SELECT * FROM users WHERE Username = $1 OR Email = $1';
  //query is not finding anything so account for that!
  try {
    const response = await db.query(q, [User]);

    if (response.rows.length < 1)
      return next({
        message: {
          error: true,
          msg: 'The username or email you gave does not exist.',
          errors: { user: true, password: true },
        },
        status: 404,
      });
    else {
      if (
        User === response.rows[0].username ||
        User === response.rows[0].email
      ) {
        const match = await bcrypt.compare(Password, response.rows[0].password);
        if (match) {
          res.locals.user = true;
          res.locals.userInfo = response.rows[0];
          return next();
        } else {
          res.locals.user = false;
          return next({
            message: {
              error: true,
              msg: 'email or password is incorrect.',
              errors: { user: true, password: true },
            },
            status: 400,
          });
        }
      } else {
        res.locals.user = false;
        return next({
          message: {
            error: true,
            msg: 'The username or email you gave does not exist',
            errors: { user: true, password: true },
          },
          status: 400,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export default userController;
