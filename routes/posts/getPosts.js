import express from "express";

import { getPostsInBounds } from "../../database/posts.database.js";
import {
  clamp,
  toNumber,
  haversineDistance,
} from "./utils/haversineDistance.js";
import { bayesianShrinkage, globalAverage } from "./utils/bayesianShrinkage.js";

const router = express.Router();

const BOUNDS_THRESHOLD_RATIO = 0.2;
const MIN_LAT_THRESHOLD_DEGREES = 0.01;
const MIN_LONG_THRESHOLD_DEGREES = 0.01;

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

  try {
    const parsedUserLong = toNumber(userLong);
    const parsedUserLat = toNumber(userLat);
    const parsedZoom = toNumber(zoom);
    const parsedNorthEastLong = toNumber(northEastLong);
    const parsedNorthEastLat = toNumber(northEastLat);
    const parsedSouthWestLong = toNumber(southWestLong);
    const parsedSouthWestLat = toNumber(southWestLat);

    if (
      Number.isNaN(parsedUserLong) ||
      Number.isNaN(parsedUserLat) ||
      Number.isNaN(parsedZoom) ||
      Number.isNaN(parsedNorthEastLong) ||
      Number.isNaN(parsedNorthEastLat) ||
      Number.isNaN(parsedSouthWestLong) ||
      Number.isNaN(parsedSouthWestLat)
    ) {
      return res
        .status(400)
        .send("unable to parse location parameters from request");
    }

    const latSpan = Math.abs(parsedNorthEastLat - parsedSouthWestLat);
    const crossesAntimeridian = parsedSouthWestLong > parsedNorthEastLong;
    const rawLongSpan = Math.abs(parsedNorthEastLong - parsedSouthWestLong);
    const longSpan = crossesAntimeridian ? 360 - rawLongSpan : rawLongSpan;
    const zoomModifier = parsedZoom > 0 ? parsedZoom : 1;

    const latThreshold = Math.max(
      latSpan * BOUNDS_THRESHOLD_RATIO,
      MIN_LAT_THRESHOLD_DEGREES / zoomModifier,
    );
    const longThreshold = Math.max(
      longSpan * BOUNDS_THRESHOLD_RATIO,
      MIN_LONG_THRESHOLD_DEGREES / zoomModifier,
    );

    const minLat = clamp(
      Math.min(parsedNorthEastLat, parsedSouthWestLat) - latThreshold,
      -90,
      90,
    );
    const maxLat = clamp(
      Math.max(parsedNorthEastLat, parsedSouthWestLat) + latThreshold,
      -90,
      90,
    );

    const minLong = clamp(parsedSouthWestLong - longThreshold, -180, 180);
    const maxLong = clamp(parsedNorthEastLong + longThreshold, -180, 180);

    const posts = await getPostsInBounds({
      minLat,
      maxLat,
      minLong,
      maxLong,
      crossesAntimeridian,
    });

    if (!posts) {
      return res
        .status(500)
        .send("Server error, unable to retrieve posts for bounds");
    }

    delete posts.createdAt;
    delete posts.deletedAt;
    delete posts.post_id;
    delete posts.updatedAt;
    delete posts.user_id_link;

    const postsWithDistance = posts.map((post) => {
      const postData = post.get({ plain: true });
      const postLong = toNumber(postData.longitude);
      const postLat = toNumber(postData.latitude);
      const distance =
        Number.isNaN(postLong) || Number.isNaN(postLat)
          ? null
          : haversineDistance(parsedUserLat, parsedUserLong, postLat, postLong);

      return {
        ...postData,
        distance,
      };
    });

    postsWithDistance.sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    return res.status(200).json(postsWithDistance);
  } catch (error) {
    console.log("error getting posts:", error);
    return res.status(500).send("Server error retrieving posts");
  }
});

export default router;
