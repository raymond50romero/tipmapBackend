import express from "express";
import axios from "axios";

import authorizeUser from "../../middleware/authorizeUser.js";
import { getIpInfo } from "../../utils/getIpInfo.js";
import { getLongLat } from "../../utils/geoCoding.js";
import { createNewPost, getPosts } from "../../database/posts.database.js";

const mapboxToken = process.env.MAP_TOKEN;

const router = express.Router();

router.post("/newPost", authorizeUser, async (req, res) => {
  const {
    name,
    address,
    city,
    state,
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
  const userLongitude = userLongLat[0] ? userLongLat[0] : null;
  const userLatitude = userLongLat[1] ? userLongLat[1] : null;

  if (!name) return res.status(400).send("Restaurant name missing");
  if (!address) return res.status(400).send("Restaurant address missing");
  if (!city) return res.status(400).send("Restaurant city missing");
  if (!state) return res.status(400).send("Restaurant state missing");
  if (!weekdayTips) return res.status(400).send("Average weekday tips missing");
  if (!weekendTips) return res.status(400).send("Average weekend tips missing");
  if (!weekendTips) return res.status(400).send("Average weekend tips missing");
  if (!workenv) return res.status(400).send("Work environment rating missing");
  if (!management) return res.status(400).send("Management rating missing");
  if (!clientele) return res.status(400).send("Clientele rating missing");

  try {
    if (!mapboxToken) {
      throw new Error("Missing mapbox token");
    }

    // potentially looking at ways to verify the user is from the united states, idk if that will be possible
    //const userIpInfo = await getIpInfo(req.ip);
    //const userCountry = userIpInfo.country_code;

    let proximity = null;
    console.log("this is userLongLat: ", userLongLat);
    if (userLongLat) proximity = [userLongLat[0], userLongLat[1]];

    // TODO check if the cache holds what I need, for now just go on

    const encoded = encodeURIComponent(
      address.trim() + city.trim() + state.trim(),
    );
    let url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encoded}`;
    if (proximity) {
      const longEncoded = encodeURIComponent(proximity[0]);
      const latEncoded = encodeURIComponent(proximity[1]);
      url += `&proximity=${longEncoded},${latEncoded}`;
    }

    const longLat = await getLongLat(url);
    console.log("this is restaurant longLat: ", longLat);
    let longitude;
    let latitude;
    if (longLat) {
      longitude = longLat[0];
      latitude = longLat[1];
    } else {
      console.log("unable to get longitude and latitude");
      return res
        .status(500)
        .send("Server fault, unable to get restaurant accurate address");
    }

    const newPost = await createNewPost(
      user.user_id,
      name,
      address,
      city,
      state,
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

router.get("/getPosts", async (req, res) => {
  try {
    const allPosts = await getPosts();
    delete allPosts.post_id;
    delete allPosts.user_id_link;
    return res.status(200).send(allPosts);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

export default router;
