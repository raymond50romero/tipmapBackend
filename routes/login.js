import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  findUserByEmail,
  findUserByUsername,
} from '../database/users.database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { emailOrUser, password } = req.body;

  if (!emailOrUser) return res.status(400).send('Email missing');
  if (!password) return res.status(400).send('Password missing');

  // first check if the user input their email for the login
  const findViaEmail = await findUserByEmail(emailOrUser);
  let getToken;
  if (findViaEmail) {
    getToken = await checkPasswordAndGetToken(findViaEmail, password);
    if (findViaEmail.email !== emailOrUser || !getToken) {
      return res.status(403).send('Email or password was incorrect');
    }
  }

  // if they didn't input their email then check if the user input their username
  const findViaUser = await findUserByUsername(emailOrUser);
  if (findViaUser) {
    getToken = await checkPasswordAndGetToken(findViaUser, password);
    if (findViaUser.username !== emailOrUser || !getToken) {
      return res.status(403).send('Email or password was incorrect');
    }
  }

  // if it gets here then the user used the correct email/username and password
  let cookieDuration = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  res.cookie('userToken', getToken, {
    httpOnly: true,
    expires: cookieDuration,
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).send({
    message: `login sucessful for user ${findViaEmail.username}`,
    token: getToken,
  });
});

/**************************
 *                        *
 *    HELPER FUNCTIONS    *
 *                        *
 **************************/

async function checkPasswordAndGetToken(existingUser, password) {
  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) return false;
  else {
    delete existingUser.password;

    const userToken = jwt.sign(
      { userId: existingUser.user_id },
      process.env.USER_TOKEN_SECRET,
      {
        expiresIn: '30d',
      }
    );

    return userToken;
  }
}

export default router;
