import axios from "axios";

const ipToken = process.env.IP_INFO_TOKEN;

export default async function getIpInfo(ip) {
  return await axios
    .get(`https://api.ipinfo.io/lite/${ip}?token=${ipToken}`)
    .then((response) => {
      if (!response) {
        return false;
      }
      return response;
    });
}
