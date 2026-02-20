import express from "express";

import authorizeUser from "../../middleware/authorizeUser.js";
import { createNewPost } from "../../database/posts.database.js";
import {
  createAvgPost,
  getAvgPostByLongLat,
  updateAvgPostById,
} from "../../database/averagePosts.database.js";
import { getNewAverage } from "./utils/getAverages.js";
import { getIpInfo } from "../../utils/getIpInfo.js";

const mapboxToken = process.env.MAP_TOKEN;

const router = express.Router();

router.post("/", authorizeUser, async (req, res) => {
  const {
    mapCenter,
    brandId,
    mapboxId,
    name,
    address,
    place,
    longitude,
    latitude,
    userLongLat,
    weekdayTips,
    weekendTips,
    workenv,
    management,
    clientele,
    title,
    comment,
  } = req.body;

  const user = req.user;
  if (!user) return res.status(400).send("no user found");

  if (!brandId) return res.status(400).send("Brand id missing");
  if (!mapboxId) return res.status(400).send("Mapbox id missing");
  if (!name) return res.status(400).send("Restaurant name missing");
  if (!address) return res.status(400).send("Restaurant address missing");
  if (!place) return res.status(400).send("Restaurant place missing");
  if (!longitude || !latitude)
    return res.status(400).send("No longitude or latitude given");
  if (!weekdayTips) return res.status(400).send("Average weekday tips missing");
  if (!weekendTips) return res.status(400).send("Average weekend tips missing");
  if (!weekendTips) return res.status(400).send("Average weekend tips missing");
  if (!workenv) return res.status(400).send("Work environment rating missing");
  if (!management) return res.status(400).send("Management rating missing");
  if (!clientele) return res.status(400).send("Clientele rating missing");

  try {
    if (!mapboxToken) throw new Error("Missing mapbox token");

    const encoded = encodeURIComponent(address.trim() + "," + place.trim());
    let url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encoded}`;
    let longEncoded;
    let latEncoded;
    if (userLongLat) {
      longEncoded = encodeURIComponent(userLongLat[0]);
      latEncoded = encodeURIComponent(userLongLat[1]);
    } else {
      longEncoded = encodeURIComponent(mapCenter[0]);
      latEncoded = encodeURIComponent(mapCenter[1]);
    }
    url += `&proximity=${longEncoded},${latEncoded}`;

    console.log();
    console.log("this is url: ", url);
    console.log();

    // first check if an average post already exists, then update
    let avgPost;
    const truncatedRestLong = Math.trunc(longitude * 1e6) / 1e6;
    const truncatedRestLat = Math.trunc(latitude * 1e6) / 1e6;
    const ifAvgPost = await getAvgPostByLongLat(
      truncatedRestLong,
      truncatedRestLat,
    );
    console.log("this is result from trying to find ifAvgPost: ", ifAvgPost);
    if (ifAvgPost) {
      const newWeekday = getNewAverage(
        ifAvgPost.weekday_tips_average,
        weekdayTips,
        ifAvgPost.weekday_tips_count,
      );
      const newWeekend = getNewAverage(
        ifAvgPost.weekend_tips_average,
        weekendTips,
        ifAvgPost.weekend_tips_count,
      );
      const newWorkEnv = getNewAverage(
        ifAvgPost.work_environment_average,
        workenv,
        ifAvgPost.work_environment_count,
      );
      const newManagement = getNewAverage(
        ifAvgPost.management_average,
        management,
        ifAvgPost.management_count,
      );
      const newClientele = getNewAverage(
        ifAvgPost.clientele_average,
        clientele,
        ifAvgPost.clientele_count,
      );

      avgPost = await updateAvgPostById(
        ifAvgPost.average_post_id,
        newWeekday.newAvg,
        newWeekday.newTotal,
        newWeekend.newAvg,
        newWeekend.newTotal,
        newWorkEnv.newAvg,
        newWorkEnv.newTotal,
        newManagement.newAvg,
        newManagement.newTotal,
        newClientele.newAvg,
        newClientele.newTotal,
      );
      if (avgPost) {
        console.log("sucessfully updated: ", avgPost);
      } else {
        console.log("unable to update average result");
      }
    } else {
      avgPost = await createAvgPost(
        truncatedRestLong,
        truncatedRestLat,
        weekdayTips,
        weekendTips,
        workenv,
        management,
        clientele,
      );
      console.log("no average post exists, creating new one: ", avgPost);
    }

    const postId = avgPost.average_post_id
      ? avgPost.average_post_id
      : ifAvgPost.average_post_id;

    const newPost = await createNewPost(
      user.user_id,
      postId,
      brandId,
      mapboxId,
      name,
      address,
      place,
      longitude,
      latitude,
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
