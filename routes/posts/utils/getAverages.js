/**
 * @param {Array} ratings
 * @returns {number} average number of the array
 */
export function getAverage(ratings) {
  if (!ratings) return false;

  return (
    ratings.reduce((sum, currentValue) => sum + currentValue, 0) /
    ratings.length
  );
}

/**
 * gets new average given old average and total number of saved entries
 *
 * @param {number} oldAvg
 * @param {number} newValue
 * @param {number} n
 * @returns {object} new average and new total
 */
export function getNewAverage(oldAvg, newValue, n) {
  const newAvg = (oldAvg * n + newValue) / (n + 1);
  const newTotal = n + 1;
  return { newAvg: newAvg, newTotal: newTotal };
}
