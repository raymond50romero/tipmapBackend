import axios from "axios";

const mapboxToken = process.env.MAP_TOKEN;

export async function geocodingResults(url) {
  if (!url) return false;

  url += `&access_token=${mapboxToken}`;

  return await axios
    .get(url)
    .then((result) => {
      if (result) {
        console.log("geocoding result: ", result);
        return result;
      } else {
        console.log("no result");
        return false;
      }
    })
    .catch((error) => {
      console.log("found error: ", error);
      return false;
    });
}

export async function getLongLat(url) {
  const geocode = await geocodingResults(url);
  return [
    geocode.data.features[0].properties.coordinates.longitude,
    geocode.data.features[0].properties.coordinates.latitude,
  ];
}
