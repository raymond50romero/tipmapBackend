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
