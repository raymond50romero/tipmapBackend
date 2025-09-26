import express from "express";

import { getPostsInBounds } from "../../database/posts.database.js";

const router = express.Router();

const EARTH_RADIUS = 6378137;
const BOUNDS_THRESHOLD_RATIO = 0.2;
const MIN_LAT_THRESHOLD_DEGREES = 0.01;
const MIN_LONG_THRESHOLD_DEGREES = 0.01;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function haversineDistance(lat1, long1, lat2, long2) {
  function toRadians(deg) {
    return (deg * Math.PI) / 180;
  }
  const dLat = toRadians(lat2 - lat1);
  const dLong = toRadians(long2 - long1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

router.get("/", async (req, res) => {
  const {
    userLong,
    userLat,
    zoom,
    northEastLong,
    northEastLat,
    southWestLong,
    southWestLat,
  } = req.query;
  console.log("this is req.query:", req.query);
  if (
    !userLong ||
    !userLat ||
    !zoom ||
    !northEastLong ||
    !northEastLat ||
    !southWestLong ||
    !southWestLat
  )
    return res.status(400).send("unable to get necessary location identifiers");
});
