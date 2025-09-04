import { sequelize } from "./models/connect.js";
import { posts } from "./models/posts.model.js";

export async function createNewPost(
  name,
  address,
  weekdayTips,
  weekendTips,
  workenv,
  management,
  clientele,
  title,
  comment,
) {
  if (
    !name ||
    !address ||
    !weekdayTips ||
    !weekendTips ||
    !workenv ||
    !management ||
    !clientele
  ) {
    return false;
  }

  return await sequelize.sync().then(async () => {
    return await posts.create({});
  });
}
