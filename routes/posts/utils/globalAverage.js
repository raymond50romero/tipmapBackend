import { getAvgPostById } from "../../../database/averagePosts.database.js";

/**
 * get the global average of all the posts
 *
 * @param {Object} postsWithDistance
 * @returns {Object} contains weekday and weekend global average
 */
export default async function getGlobalAverage(postsWithDistance) {
  if (!postsWithDistance) return false;

  let avgPostIds = [];
  const localWeekdayMeans = [];
  const localWeekendMeans = [];
  for (let i in postsWithDistance) {
    if (!avgPostIds.includes(postsWithDistance[i].average_id_link)) {
      avgPostIds.push(postsWithDistance[i].average_id_link);
      let avgPost = await getAvgPostById(postsWithDistance[i].average_id_link);

      localWeekdayMeans[i] = {
        mean: avgPost.weekday_tips_average,
        total: avgPost.weekday_tips_count,
      };
      localWeekendMeans[i] = {
        mean: avgPost.weekend_tips_average,
        total: avgPost.weekend_tips_average,
      };
    }
  }
  const weekdayGA = globalAverage(localWeekdayMeans);
  const weekendGA = globalAverage(localWeekendMeans);

  return {
    weekdayGlobalAverage: weekdayGA,
    weekendGlobalAverage: weekendGA,
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
