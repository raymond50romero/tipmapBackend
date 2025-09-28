const EARTH_RADIUS = 6378137;

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(lat1, long1, lat2, long2) {
  const dLat = toRadians(lat2 - lat1);
  const dLong = toRadians(long2 - long1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}
