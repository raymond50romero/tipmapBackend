import express from "express";

import authorizeUser from "../../middleware/authorizeUser.js";
import { createNewPost } from "../../database/posts.database.js";

const router = express.Router();

router.post("/", authorizeUser, async (req, res) => {
  const {
    name,
    address,
    weekdayTips,
    weekendTips,
    workenv,
    management,
    clientele,
    title,
    comment,
  } = req.body;

  const user = req.user;

  if (!name) return res.status(400).send("Restaurant name missing");
  if (!address) return res.status(400).send("Restaurant address missing");
  if (!weekdayTips) return res.status(400).send("Average weekday tips missing");
  if (!weekendTips) return res.status(400).send("Average weekend tips missing");
  if (!weekendTips) return res.status(400).send("Average weekend tips missing");
  if (!workenv) return res.status(400).send("Work environment rating missing");
  if (!management) return res.status(400).send("Management rating missing");
  if (!clientele) return res.status(400).send("Clientele rating missing");

  try {
    const newPost = await createNewPost(
      user.user_id,
      name,
      address,
      weekdayTips,
      weekendTips,
      workenv,
      management,
      clientele,
      title,
      comment,
    );

    if (newPost) {
      return res.status(201).send("New post created");
    } else {
      return res.status(500).send("Server error, could not create new post");
    }
  } catch (error) {
    console.log("could not make new post \n", error);
    return res.status(500).send("Server error, could not create new post");
  }
});

export default router;
