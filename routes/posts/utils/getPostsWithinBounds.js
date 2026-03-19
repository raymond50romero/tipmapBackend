import { getPostsInBounds } from "../../../database/posts.database.js";
import { clamp } from "./haversineDistance.js";

const BOUNDS_THRESHOLD_RATIO = 0.2;
const MIN_LAT_THRESHOLD_DEGREES = 0.01;
const MIN_LONG_THRESHOLD_DEGREES = 0.01;

/**
 * get all posts within the given map bounds
 *
 * @param {number} parsedNorthEastLong
 * @param {number} parsedSouthWestLong
 * @param {number} parsedNorthEastLat
 * @param {number} parsedSouthWestLat
 * @returns {Promise<object[]|boolean>} object that contains all of the posts, false otherwise
 */
export default async function getPostsWithinBounds(
  parsedNorthEastLong,
  parsedSouthWestLong,
  parsedNorthEastLat,
  parsedSouthWestLat,
  parsedZoom,
) {
  const latSpan = Math.abs(parsedNorthEastLat - parsedSouthWestLat);
  const crossesAntimeridian = parsedSouthWestLong > parsedNorthEastLong;
  const rawLongSpan = Math.abs(parsedNorthEastLong - parsedSouthWestLong);
  const longSpan = crossesAntimeridian ? 360 - rawLongSpan : rawLongSpan;
  const zoomModifier = parsedZoom > 0 ? parsedZoom : 1;

  const latThreshold = Math.max(
    latSpan * BOUNDS_THRESHOLD_RATIO,
    MIN_LAT_THRESHOLD_DEGREES / zoomModifier,
  );
  const longThreshold = Math.max(
    longSpan * BOUNDS_THRESHOLD_RATIO,
    MIN_LONG_THRESHOLD_DEGREES / zoomModifier,
  );

  const minLat = clamp(
    Math.min(parsedNorthEastLat, parsedSouthWestLat) - latThreshold,
    -90,
    90,
  );
  const maxLat = clamp(
    Math.max(parsedNorthEastLat, parsedSouthWestLat) + latThreshold,
    -90,
    90,
  );

  const minLong = clamp(parsedSouthWestLong - longThreshold, -180, 180);
  const maxLong = clamp(parsedNorthEastLong + longThreshold, -180, 180);

  const posts = await getPostsInBounds({
    minLat,
    maxLat,
    minLong,
    maxLong,
    crossesAntimeridian,
  });

  if (!posts) return false;
  else return posts;
}
