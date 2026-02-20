import { Op } from "sequelize";
import { sequelize } from "./models/connect.js";
import { avgPosts } from "./models/avgPosts.model.js";

export async function createAvgPost(
  mapboxId,
  longitude,
  latitude,
  weekdayTips,
  weekendTips,
  workEnv,
  management,
  clientele,
) {
  if (
    !mapboxId ||
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
    .then(async () => {
      return await avgPosts
        .create({
          mapbox_id: mapboxId,
          longitude: longitude,
          latitude: latitude,
          weekday_tips_average: weekdayTips,
          weekday_tips_count: 1,
          weekend_tips_average: weekendTips,
          weekend_tips_count: 1,
          work_environment_average: workEnv,
          work_environment_count: 1,
          management_average: management,
          management_count: 1,
          clientele_average: clientele,
          clientele_count: 1,
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

export async function getAvgPostByLongLat(longitude, latitude) {
  if (!longitude || !latitude) {
    console.log("no long or lat in getAvgPostByLongLat");
    return false;
  }

  return await sequelize
    .sync()
    .then(async () => {
      return await avgPosts
        .findAll({
          where: {
            longitude: longitude,
            latitude: latitude,
          },
        })
        .then((res) => {
          if (Object.keys(res).length !== 0) {
            console.log("found similar average posts: ", res);
            return res[0];
          } else {
            console.log("unable to find similar average posts: ", res);
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

/**
 * find average post by the mapbox id given in mapbox search
 *
 * @param {number} mapboxId
 *
 * @returns {Promise<object[]|boolean>}
 */
export async function getAvgPostById(mapboxId) {
  if (!mapboxId) return false;

  return await sequelize
    .sync()
    .then(async () => {
      return await avgPosts
        .findAll({
          where: { mapbox_id: mapboxId },
        })
        .then((res) => {
          if (Object.keys(res).length !== 0) {
            console.log("found average post: ", res[0]);
            return res[0];
          } else {
            console.log("unable to find average post");
            return false;
          }
        })
        .catch((error) => {
          console.log("error when grabbing average post by id: ", error);
          return false;
        });
    })
    .catch((error) => {
      console.log("error when syncing to database: ", error);
      return false;
    });
}

export async function updateAvgPostById(
  mapboxId,
  newAvgWeekday,
  newWeekdayCount,
  newAvgWeekend,
  newWeekendCount,
  newWorkEnv,
  newWorkEnvCount,
  newManagement,
  newManagementCount,
  newClientele,
  newClienteleCount,
) {
  if (
    !mapboxId ||
    !newAvgWeekday ||
    !newWeekdayCount ||
    !newAvgWeekend ||
    !newWeekendCount ||
    !newWorkEnv ||
    !newWorkEnvCount ||
    !newManagement ||
    !newManagementCount ||
    !newClientele ||
    !newClienteleCount
  )
    return false;

  return await sequelize
    .sync()
    .then(async () => {
      return await avgPosts
        .update(
          {
            weekday_tips_average: newAvgWeekday,
            weekday_tips_count: newWeekdayCount,
            weekend_tips_average: newAvgWeekend,
            weekend_tips_count: newWeekendCount,
            work_environment_average: newWorkEnv,
            work_environment_count: newWorkEnvCount,
            management_average: newManagement,
            management_count: newManagementCount,
            clientele_average: newClientele,
            clientele_count: newClienteleCount,
          },
          { where: { mapbox_id: mapboxId } },
        )
        .then((res) => {
          if (res) {
            console.log("average post updated successfully: ", res);
            return res;
          } else {
            console.log("unable to update average post");
            return false;
          }
        })
        .catch((error) => {
          console.log("error when updating average post: ", error);
          return false;
        });
    })
    .catch((error) => {
      console.log("error when syncing to database: ", error);
      return false;
    });
}
