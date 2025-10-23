import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Geocode an address using Google Maps Geocoding API
 * @param {string} address - street adrdress
 * @param {string} city - city name
 * @param {string} state - state abbr
 * @returns {Promise<{lat: number, lng: number, formatted_address: string, precision: string}>}
 */
export async function getLongLat(address, city, state) {
  if (!address || !city || !state) return false;
  try {
    if (!GOOGLE_API_KEY) {
      throw new Error("Missing GOOGLE_MAPS_API_KEY in environment variables");
    }

    // Build full query
    const fullAddress = `${address}, ${city}, ${state}`;

    // Make request to Google Maps Geocoding API
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: fullAddress,
          key: GOOGLE_API_KEY,
          // Optional: restrict to US addresses
          components: "country:US",
        },
        timeout: 8000,
      },
    );

    const data = response.data;

    // Validate API response
    if (data.status !== "OK" || !data.results.length) {
      throw new Error(
        `Geocoding failed: ${data.status} - ${data.error_message || "No results"}`,
      );
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;
    const formatted_address = result.formatted_address;
    const precision = result.geometry.location_type; // e.g. ROOFTOP, APPROXIMATE

    return { lat, lng, formatted_address, precision };
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    throw error;
  }
}
