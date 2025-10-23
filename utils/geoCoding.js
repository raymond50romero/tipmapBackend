import axios from "axios";
import { states } from "./50states.js";

const mapboxToken = process.env.MAP_TOKEN;

export async function geocodingResults(url) {
  if (!url) return false;

  url += `&access_token=${mapboxToken}`;

  return await axios
    .get(url)
    .then((result) => {
      if (result) {
        return result;
      } else {
        console.log("no geocoding result");
        return false;
      }
    })
    .catch((error) => {
      console.log("found error: ", error);
      return false;
    });
}

export async function getLongLat(url, state) {
  const geocode = await geocodingResults(url);
  console.log();
  console.log("this is geocoding.data results: ", geocode.data.features);
  console.log();
  let ans;
  for (let i in geocode.data.features) {
    if (
      geocode.data.features[i].properties.place_formatted.includes(
        states[state],
      )
    ) {
      ans = [
        geocode.data.features[i].properties.coordinates.longitude,
        geocode.data.features[i].properties.coordinates.latitude,
      ];
      console.log("this is the long lat ans: ", ans);
    }
  }
  if (!ans) ans = false;

  return ans;
}
