import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
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

  if (!name) res.status(400).send("Restaurant name missing");
  if (!address) res.status(400).send("Restaurant address missing");
  if (!weekdayTips) res.status(400).send("Average weekday tips missing");
  if (!weekendTips) res.status(400).send("Average weekend tips missing");
  if (!weekendTips) res.status(400).send("Average weekend tips missing");
  if (!workenv) res.status(400).send("Work environment rating missing");
  if (!management) res.status(400).send("Management rating missing");
  if (!clientele) res.status(400).send("Clientele rating missing");
});
