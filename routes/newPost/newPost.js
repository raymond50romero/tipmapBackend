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
  } = req.body;
});
