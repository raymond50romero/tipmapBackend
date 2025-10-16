/**
 * @param {number} avgRating
 * @param {number} totalRatings
 * @param {number} globalAvg
 * @param {number} priorStrength
 *
 */
export function bayesianShrinkage(
  avgRating,
  totalRatings,
  globalAvg,
  priorStrength,
) {
  if (!avgRating || !totalRatings || !globalAvg || !priorStrength) return false;

  const numerator = totalRatings * avgRating + priorStrength * globalAvg;
  const denominator = totalRatings + priorStrength;
  return numerator / denominator;
}

/**
 * @param {Array} localMeans array of objects containing mean and total
 * @returns {number|boolean} returns the average of all the means or false if no average found
 */
export function globalAverage(localMeans) {
  if (!localMeans) return false;

  let numerator = 0;
  let denominator = 0;
  for (let i in localMeans) {
    numerator += localMeans[i].mean * localMeans[i].total;
    denominator += localMeans[i].total;
  }
  if (denominator !== 0) return numerator / denominator;
  else return false;
}
