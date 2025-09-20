import express from "express";
import LRUCache from "lru-cache";
import axios from "axios";

import authorizeUser from "../../middleware/authorizeUser.js";
import { getIpInfo } from "../../utils/getIpInfo.js";
import { createNewPost, getPosts } from "../../database/posts.database.js";

const mapboxToken = process.env.MAP_TOKEN;

const router = express.Router();

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 10,
});

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
    const userIpInfo = getIpInfo(req.ip);
    console.log("this is userIpInfo", userIpInfo);
    const userCountry = userIpInfo.country_code;

    if (userCountry !== "US") {
      return res.status(403).send("Ip is not from the United States");
    }

    let proximity = null;
    if (longitude && latitude) proximity = [longitude, latitude];
    const key = JSON.stringify({ address, userCountry, proximity });

    // TODO check if the cache holds what I need, for now just go on

    const encoded = encodeURIComponent(
      address.trim() + city.trim() + state.trim(),
    );
    let url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encoded}`;
    if (proximity) {
      const longEncoded = encodeURIComponent(longitude);
      const latEncoded = encodeURIComponent(latitude);
      url += `&proximity=${longEncoded},${latEncoded}`;
    }
    url += `&access_token=${mapboxToken}`;

    const geocodingResult = await axios
      .get(url)
      .then((res) => {
        if (res) {
          console.log("this is geocoding result: ", res);
          return res;
        } else {
          console.log("geocoding result returned false");
          return false;
        }
      })
      .catch((error) => {
        console.log("geocoding ran into error: ", error);
        return false;
      });

    let longitude;
    let latitude;
    if (geocodingResult) {
      longitude =
        geocodingResult.data.features[0].properties.coordinates.longitude;
      latitude =
        geocodingResult.data.features[0].properties.coordinates.latitude;
    } else {
      throw new Error("geocoding did not return any results");
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
