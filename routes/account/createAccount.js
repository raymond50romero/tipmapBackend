import express from "express";
import bcrypt from "bcrypt";

import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../../database/users.database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, username, password, confirmPassword, occupation, other } =
    req.body;

  if (!email) return res.status(400).send("Email missing");
  if (!username) return res.status(400).send("Username missing");
  if (!password) return res.status(400).send("Password missing");
  if (!confirmPassword) return res.status(400).send("Confirm password missing");
  if (!occupation) return res.status(400).send("Occupation missing");

  if (password !== confirmPassword)
    return res.status(406).send("Passwords do not match");

  try {
    // check if username or email exists
    if (await findUserByEmail(email)) {
      return res.status(409).send(`${email} already exists`);
    }
    if (await findUserByUsername(username)) {
      return res.status(409).send(`${username} already exists`);
    }

    // if not then hash password and save user to database
    const hashedPassword = await bcrypt.hash(password, 10);
    const occList = getOccupationsList(occupation);
    // TODO I am just passing in raw data from other and saving it to database, may cause
    // a security risk later. need to screen before saving
    const newUser = await createUser(
      email,
      username,
      hashedPassword,
      occList.bartender,
      occList.server,
      other,
    );

    if (newUser) {
      return res.status(201).send("user created");
    } else
      return res.status(500).send("Server error, could not create new user");
  } catch (error) {
    console.log("could not make new user \n", error);
    return res.status(500).send("Server error, could not make new user");
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
    server: false,
  };

  for (let i in occupations) {
    switch (occupations[i]) {
      case "bartender":
        occObj.bartender = true;
        break;
      case "server":
        occObj.server = true;
        break;
      default:
        break;
    }
  }

  return occObj;
}

export default router;
