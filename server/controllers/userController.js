import db from '../models/UserModel.js';

const userController = {};

userController.checkUserCred = async (req, res, next) => {
  const { Username, Email } = req.body;

  const q = 'SELECT 1 FROM users WHERE Username = $1 OR Email = $2';

  const response = await db.query(q, [Username, Email]);

  if (response.rows.length < 1) {
    res.locals.check = false;
  } else res.locals.check = true;

  return next();
};

userController.addUserCred = async (req, res, next) => {
  const { Username, Email, FirstName, LastName, Password } = req.body;

  if (res.locals.check === false) {
    const q =
      'INSERT INTO users (username, email, firstName, lastName, password) VALUES ($1, $2, $3, $4, $5)';
    await db.query(
      q,
      [Username, Email, FirstName, LastName, Password],
      (err, result) => {
        if (err) {
          throw new Error(err);
        } else {
          res.locals.user = true;
          return next();
        }
      }
    );
  } else return next({ message: 'Username or Email already in use' });
};

userController.login = async (req, res, next) => {
  const { User, Password } = req.body;

  const q = 'SELECT * FROM users WHERE Username = $1 OR Email = $1';
  //query is not finding anything so account for that!
  const response = await db.query(q, [User]);

  if (response.rows.length < 1) return next((res.locals.user = false));
  else {
    if (User === response.rows[0].username || User === response.rows[0].email) {
      if (Password === response.rows[0].password) {
        res.locals.user = true;
        return next();
      } else {
        res.locals.user = false;
        return next();
      }
    } else {
      res.locals.user = false;
      return next();
    }
  }
};

export default userController;
