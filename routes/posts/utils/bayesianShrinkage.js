import { getAvgPostById } from "../../../database/averagePosts.database.js";

/**
 * @param {Object} postsWithDistance
 * @param {Number} weekdayGlobalAverage
 * @param {Number} weekendGlobalAverage
 * @returns {Promise<Array>}
 */
export default async function doBayesianShrinkage(
  postsWithDistance,
  weekdayGlobalAverage,
  weekendGlobalAverage,
) {
  const avgPostIds = [];
  const weightsData = [];
  const priorStrength = 1;

  let weightsCount = 0;
  for (let i in postsWithDistance) {
    if (!avgPostIds.includes(postsWithDistance[i].mapbox_id)) {
      avgPostIds.push(postsWithDistance[i].mapbox_id);
      let avgPost = await getAvgPostById(postsWithDistance[i].mapbox_id);
      let weekdayBayesian = bayesianShrinkage(
        avgPost.weekday_tips_average,
        avgPost.weekday_tips_count,
        weekdayGlobalAverage,
        priorStrength,
      );
      let weekendBayesian = bayesianShrinkage(
        avgPost.weekend_tips_average,
        avgPost.weekend_tips_count,
        weekendGlobalAverage,
        priorStrength,
      );
      weightsData[weightsCount] = {
        longitude: avgPost.longitude,
        latitude: avgPost.latitude,
        weekdayWeight: weekdayBayesian,
        weekendWeight: weekendBayesian,
      };
      weightsCount++;
    }
  }

  return weightsData;
}

/**
 * @param {number} avgRating
 * @param {number} totalRatings
 * @param {number} globalAvg
 * @param {number} priorStrength
 *
 */
function bayesianShrinkage(avgRating, totalRatings, globalAvg, priorStrength) {
  if (!avgRating || !totalRatings || !globalAvg || !priorStrength) {
    console.log("a parameter is missing while doing bayesian shrinkage");
    return false;
  }

  const numerator = totalRatings * avgRating + priorStrength * globalAvg;
  const denominator = totalRatings + priorStrength;
  return numerator / denominator / 5;
}
