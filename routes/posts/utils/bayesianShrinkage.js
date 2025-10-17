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
  if (!avgRating || !totalRatings || !globalAvg || !priorStrength) {
    console.log("a parameter is missing while doing bayesian shrinkage");
    return false;
  }

  console.log("this is avgRating: ", avgRating);
  console.log("this is totalRatings: ", totalRatings);
  console.log("this is globalAvg: ", globalAvg);
  console.log("this is priorStrength: ", priorStrength);

  const numerator = totalRatings * avgRating + priorStrength * globalAvg;
  const denominator = totalRatings + priorStrength;
  return numerator / denominator / 5;
}

/**
 * @param {Array} localMeans array of objects containing mean and total
 * @returns {number|boolean} returns the average of all the means or false if no average found
 */
export function globalAverage(localMeans) {
  if (!localMeans) {
    console.log("local means is missing from global average");
    return false;
  }

  console.log("this is local means inside global average: ", localMeans);

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
