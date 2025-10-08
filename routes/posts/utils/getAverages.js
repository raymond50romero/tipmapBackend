/**
 * @param {Array} ratings
 * @returns {number} average number of the array
 */
export function getAverage(ratings) {
  if (!ratings) return false;

  return (
    array.reduce((sum, currentValue) => sum + currentValue, 0) / array.length
  );
}
