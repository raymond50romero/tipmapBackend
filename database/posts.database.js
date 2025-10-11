import { Op } from "sequelize";

import { sequelize } from "./models/connect.js";
import { posts } from "./models/posts.model.js";
import { avgPosts } from "./models/avgPosts.model.js";

/**
 *
 * @param {number} userId
 * @param {string} name
 * @param {string} address
 * @param {string} city,
 * @param {string} state,
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} weekdayTips
 * @param {number} weekendTips
 * @param {number} workenv
 * @param {number} management
 * @param {number} clientele
 * @param {string} title
 * @param {string} comment
 * @returns {Promise<object[]|boolean>} returns newly created post object, false otherwise
 */
export async function createNewPost(
  userId,
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
) {
  if (
    !userId ||
    !name ||
    !address ||
    !city ||
    !state ||
    !longitude ||
    !latitude ||
    !weekdayTips ||
    !weekendTips ||
    !workenv ||
    !management ||
    !clientele
  ) {
    console.log("missing parameters when creating new post");
    return false;
  }

  return await sequelize
    .sync()
    .then(async () => {
      return await posts
        .create({
          user_id_link: userId,
          restaurant_name: name,
          restaurant_address: address,
          restaurant_city: city,
          restaurant_state: state,
          longitude: longitude,
          latitude: latitude,
          weekday_tips: weekdayTips,
          weekend_tips: weekendTips,
          work_environment: workenv,
          management: management,
          clientele: clientele,
          title: title,
          comment: comment,
        })
        .then((res) => {
          if (res) {
            console.log("new post saved successfully ", res);
            return res;
          } else {
            console.log("unable to save new post ", res);
            return false;
          }
        })
        .catch((error) => {
          console.log("error when trying to save new post ", error);
          return false;
        });
    })
    .catch((error) => {
      console.log("error on sync with new post database ", error);
    });
}

/**
 * get all the posts in the database
 *
 * @returns {Promise<object[]|boolean>} object that contains all of the posts in the database, false otherwise
 */
export async function getPosts() {
  return await sequelize
    .sync()
    .then(async () => {
      return await posts
        .findAll()
        .then((res) => {
          if (res) {
            console.log("found all posts: ", res);
            return res;
          } else {
            console.log("res is null getting posts");
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}

/**
 * Fetch posts constrained to a latitude/longitude bounding box.
 *
 * @param {object} bounds
 * @param {number} bounds.minLat
 * @param {number} bounds.maxLat
 * @param {number} bounds.minLong
 * @param {number} bounds.maxLong
 * @param {boolean} bounds.crossesAntimeridian
 * @returns {Promise<object[]|boolean>} posts that fall inside the bounds, false otherwise
 */
export async function getPostsInBounds(bounds) {
  const { minLat, maxLat, minLong, maxLong, crossesAntimeridian } =
    bounds || {};

  if (
    typeof minLat !== "number" ||
    typeof maxLat !== "number" ||
    typeof minLong !== "number" ||
    typeof maxLong !== "number"
  ) {
    console.log("missing or invalid bounds while querying posts");
    return false;
  }

  const latitudeRange = {
    [Op.between]: [Math.max(-90, minLat), Math.min(90, maxLat)],
  };

  const safeMinLong = Math.max(-180, minLong);
  const safeMaxLong = Math.min(180, maxLong);

  const whereClause = crossesAntimeridian
    ? {
        latitude: latitudeRange,
        [Op.or]: [
          { longitude: { [Op.between]: [-180, safeMaxLong] } },
          { longitude: { [Op.between]: [safeMinLong, 180] } },
        ],
      }
    : {
        latitude: latitudeRange,
        longitude: { [Op.between]: [safeMinLong, safeMaxLong] },
      };

  return await sequelize
    .sync()
    .then(async () => {
      return await posts
        .findAll({ where: whereClause })
        .then((res) => {
          if (res) {
            console.log("found posts within bounds: ", res.length);
            return res;
          } else {
            console.log("res is null getting posts within bounds");
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}

export async function createAvgPost(
  longitude,
  latitude,
  weekdayTips,
  weekendTips,
  workEnv,
  management,
  clientele,
) {
  if (
    !longitude ||
    !latitude ||
    !weekdayTips ||
    !weekendTips ||
    !workEnv ||
    !management ||
    !clientele
  )
    return false;

  return await sequelize
    .sync()
    .then(() => {
      avgPosts
        .create({
          longitude: longitude,
          latitude: latitude,
          weekday_tips_average: weekdayTips,
          weekend_tips_average: weekendTips,
          work_environment_average: workEnv,
          management_average: management,
          clientele_average: clientele,
        })
        .then((res) => {
          if (res) {
            console.log("new average posts created successfully");
            return res;
          } else {
            console.log("unable to create new average post");
          }
        })
        .catch((error) => {
          console.log("error when trying to create new average post", error);
          return false;
        });
    })
    .catch((error) => {
      console.log("unable to sync to create new average post", error);
      return false;
    });
}

export async function getAvgPost(longitude, latitude) {
  if (!longitude || !latitude) return false;

  return await sequelize
    .sync()
    .then(async () => {
      avgPosts
        .findAll({
          where: {
            [Op.and]: [
              { longitude: `${longitude}` },
              { latitude: `${latitude}` },
            ],
          },
        })
        .then((res) => {
          if (res) {
            console.log("found similar average posts");
            return res;
          } else {
            console.log("unable to find similar average posts");
            return false;
          }
        })
        .catch((error) => {
          console.log("error when looking for average posts: ", error);
          return false;
        });
    })
    .catch((error) => {
      console.log("error when syncing looking for average posts: ", error);
      return false;
    });
}
