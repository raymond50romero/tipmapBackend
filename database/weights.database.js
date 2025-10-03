import { Op } from "sequelize";

import { sequelize } from "./models/connect.js";
import { posts } from "./models/posts.model.js";

export function getWeightPostByLongLat(long, lat) {
  if (!long || !lat) return false;

  const latitudeRange = {
    [Op.between]: [Math.max(-90, minLat), Math.min(90, maxLat)],
  };

  const safeMinLong = Math.max(-180, minLong);
  const safeMaxLong = Math.min(180, maxLong);

  const whereClause = crossesAntimeridian
    ? {
        latitude: latitudeRange,
        [Op.or]: [
          { longitude: { [Op.between]: [-180, safeMaxLong] } },
          { longitude: { [Op.between]: [safeMinLong, 180] } },
        ],
      }
    : {
        latitude: latitudeRange,
        longitude: { [Op.between]: [safeMinLong, safeMaxLong] },
      };
}
