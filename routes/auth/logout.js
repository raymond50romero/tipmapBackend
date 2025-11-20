import express from "express";

import authorizeUser from "../../middleware/authorizeUser.js";

const router = express.Router();

router.post("/", authorizeUser, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).send("no user to log out");
  }

  res.clearCookie("userToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.status(200).send("sucessfully logged out");
});

export default router;
