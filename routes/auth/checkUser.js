import express from "express";
import jwt from "jsonwebtoken";

import authorizeUser from "../../middleware/authorizeUser.js";

const router = express.Router();

router.get("/", authorizeUser, async (req, res) => {
  const user = req.user;

  if (user) {
    delete user.user_id;
    delete user.password;

    return res.status(200).send({
      message: "user is logged in",
      payload: user,
    });
  } else {
    console.log("no user authorized");
    return res.status(401).send({
      message: "user is not logged in",
      payload: null,
    });
  }
});

export default router;
