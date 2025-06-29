import express from 'express';
import bcrypt from 'bcrypt';

import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from '../database/users.database.js';

import { createOccupation } from '../database/occupation.database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, username, password, confirmPassword, occupation } = req.body;

  if (!email) return res.status(400).send('Email missing');
  if (!username) return res.status(400).send('Username missing');
  if (!password) return res.status(400).send('Password missing');
  if (!confirmPassword) return res.status(400).send('Confirm password missing');
  if (!occupation) return res.status(400).send('Occupation missing');

  if (password !== confirmPassword)
    return res.status(406).send('Passwords do not match');

  try {
    // check if username or email exists
    if (await findUserByEmail(email)) {
      return res.status(409).send('email exists');
    }
    if (await findUserByUsername(username)) {
      return res.status(409).send('username exists');
    }

    // if not then hash password and save user to database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, username, hashedPassword);

    if (newUser) {
      // set occupation list of new user
      const occList = getOccupationsList(occupation);
      const newOcc = createOccupation(
        newUser.user_id,
        occList.bartender,
        occList.busser,
        occList.host,
        occList.takeout,
        occList.server,
        occList.support,
        occList.management,
        occList.boh,
        occList.other
      );
      if (newOcc) {
        return res.status(201).send('user created');
      } else {
        return res
          .status(207)
          .send('user created but occupation was not set correctly');
      }
    } else return res.status(500).send('Server error, could not make new user');
  } catch (error) {
    console.log('could not make new user \n', error);
    return res.status(500).send('Server error, could not make new user');
  }
});

/************************
 *                      *
 *   HELPER FUNCTIONS   *
 *                      *
 ************************/
function getOccupationsList(occupations) {
  let occObj = {
    bartender: false,
    busser: false,
    host: false,
    takeout: false,
    server: false,
    support: false,
    management: false,
    boh: false,
    other: false,
  };

  for (let i in occupations) {
    switch (occupations[i]) {
      case 'bartender':
        occObj.bartender = true;
        break;
      case 'busser':
        occObj.busser = true;
        break;
      case 'host':
        occObj.host = true;
        break;
      case 'takeout':
        occObj.takeout = true;
        break;
      case 'server':
        occObj.server = true;
        break;
      case 'support':
        occObj.support = true;
        break;
      case 'management':
        occObj.management = true;
        break;
      case 'boh':
        occObj.boh = true;
        break;
      case 'other':
        occObj.other = true;
        break;
      default:
        break;
    }
  }

  return occObj;
}

export default router;
