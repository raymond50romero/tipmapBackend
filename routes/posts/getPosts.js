import express from "express";

import { toNumber } from "./utils/haversineDistance.js";
import doBayesianShrinkage from "./utils/bayesianShrinkage.js";
import getPostsWithinBounds from "./utils/getPostsWithinBounds.js";
import sortPosts from "./utils/sortPosts.js";
import getGlobalAverage from "./utils/globalAverage.js";

const router = express.Router();

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
    // check if bounds given to us is correct
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

    // grab all posts within given bounds
    const posts = await getPostsWithinBounds(
      parsedNorthEastLong,
      parsedSouthWestLong,
      parsedNorthEastLat,
      parsedSouthWestLat,
      parsedZoom,
    );

    if (!posts) {
      return res
        .status(500)
        .send("Server error, unable to retrieve posts for bounds");
    }

    // order the posts to prepare it to find the global average
    let postsWithDistance = sortPosts(posts, parsedUserLong, parsedUserLat);
    if (!postsWithDistance) {
      return res.status(204).send("No posts found in database");
    }

    // posts are ordered, get global average for bayesian shrinkage
    const {
      weekdayGlobalAverage: weekdayGlobalAverage,
      weekendGlobalAverage: weekendGlobalAverage,
    } = await getGlobalAverage(postsWithDistance);
    if (!weekdayGlobalAverage || !weekendGlobalAverage) {
      return res.status(500).send("unable to get post averages");
    }

    //have global average, now perform bayesian shrinkage of each location
    // testing priorStrengths
    // priorStrength at 1: .36 .46 .76
    // priorStrength at 20: .51 .52 .55
    // conclusion, the more data you get, the highter the priorStrength
    const weightsData = await doBayesianShrinkage(
      postsWithDistance,
      weekdayGlobalAverage,
      weekendGlobalAverage,
    );
    if (!weightsData) {
      return res.status(500).send("unable to get weights data");
    }

    return res.status(200).json({
      posts: postsWithDistance,
      weightsData: weightsData,
    });
  } catch (error) {
    console.log("error getting posts:", error);
    return res.status(500).send("Server error retrieving posts");
  }
});

export default router;
