import { getAvgPostById } from "../../../database/averagePosts.database.js";

/**
 * get the global average of all the posts
 *
 * @param {Object} postsWithDistance
 * @returns {Promise<Object>} contains weekday and weekend global average
 */
export default async function getGlobalAverage(postsWithDistance) {
  if (!postsWithDistance) return false;

  let avgPostIds = [];
  const localWeekdayMeans = [];
  const localWeekendMeans = [];
  const allAverages = [];
  for (let i in postsWithDistance) {
    if (!avgPostIds.includes(postsWithDistance[i].mapbox_id)) {
      avgPostIds.push(postsWithDistance[i].mapbox_id);
      let avgPost = await getAvgPostById(postsWithDistance[i].mapbox_id);

      localWeekdayMeans[i] = {
        mean: avgPost.weekday_tips_average,
        total: avgPost.weekday_tips_count,
      };
      localWeekendMeans[i] = {
        mean: avgPost.weekend_tips_average,
        total: avgPost.weekend_tips_average,
      };
      allAverages[i] = {
        mapboxId: avgPost.mapbox_id,
        longitude: avgPost.longitude,
        latitude: avgPost.latitude,
        weekdayTipsAverage: avgPost.weekday_tips_average,
        weekendTipsAverage: avgPost.weekend_tips_average,
        workEnvironmentAverage: avgPost.work_environment_average,
        managementAverage: avgPost.management_average,
        clienteleAverage: avgPost.clientele_average,
        overallAverage: avgPost.overall_average,
      };
    }
  }
  const weekdayGA = globalAverage(localWeekdayMeans);
  const weekendGA = globalAverage(localWeekendMeans);

  return {
    weekdayGlobalAverage: weekdayGA,
    weekendGlobalAverage: weekendGA,
    allAverages: allAverages,
  };
}

/**
 * HELPER
 * find the global average of each post from their mean
 *
 * @param {Array} localMeans array of objects containing mean and total
 * @returns {number|boolean} returns the average of all the means or false if no average found
 */
function globalAverage(localMeans) {
  if (!localMeans) {
    console.log("local means is missing from global average");
    return false;
  }

  let numerator = 0;
  let denominator = 0;
  for (let i in localMeans) {
    numerator += localMeans[i].mean * localMeans[i].total;
    denominator += localMeans[i].total;
  }
  if (denominator !== 0) return numerator / denominator;
  else {
    console.log("returning false while doing global average");
    return false;
  }
}
