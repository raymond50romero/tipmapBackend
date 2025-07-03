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

  // check both email and user input to see what was the input
  const [userByEmail, userByUsername] = await Promise.all([
    findUserByEmail(emailOrUser),
    findUserByUsername(emailOrUser),
  ]);

  // if no match then return invalid
  if (!userByEmail && !userByUsername) {
    return res.status(401).send('Invalid email/username or password');
  }

  const user = userByEmail || userByUsername;
  const matchInput = userByEmail
    ? user.email === emailOrUser
    : user.username === emailOrUser;

  if (!matchInput) {
    return res.status(403).send('Email or password was incorrect');
  }

  // check password
  const token = await checkPasswordAndGetToken(user, password);
  if (!token) {
    return res.status(403).send('Email or password was incorrect');
  }

  // user exist and is valid, set cookie and return status 200
  const cookieExpires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  res.cookie('userToken', token, {
    httpOnly: true,
    expires: cookieExpires,
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).send(`Login successful for user ${user.username}`);
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
