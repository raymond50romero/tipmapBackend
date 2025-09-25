import express from "express";

import { getPosts } from "../../database/posts.database.js";

const router = express.Router();

const EARTH_RADIUS = 6378137;
const TILE_SIZE = 512;

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

  return res.status(200).send("all good on posts");
});

/*
function metersPerPixel(z, latDeg) {
  const phi = (latDeg * Math.PI) / 180;
  return (
    (Math.cos(phi) * 2 * Math.PI * EARTH_RADIUS) / (TILE_SIZE * Math.pow(2, z))
  );
}

function metersToLat(meters) {
  return (meters / R) * (180 / Math.PI);
}

function metersToLong(meters, latDeg) {
  return (meters / (R * Math.cos((latDeg * Math.PI) / 180))) * (180 / Math.PI);
}
*/

export default router;
