import { sequelize } from "./models/connect.js";
import { posts } from "./models/posts.model.js";

/**
 *
 * @param {number} userId
 * @param {string} name
 * @param {string} address
 * @param {number} weekdayTips
 * @param {number} weekendTips
 * @param {number} workenv
 * @param {number} management
 * @param {number} clientele
 * @param {string} title
 * @param {string} comment
 * @returns {Promise<object>} returns newly created post object, false otherwise
 */
export async function createNewPost(
  userId,
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
    !userId ||
    !name ||
    !address ||
    !weekdayTips ||
    !weekendTips ||
    !workenv ||
    !management ||
    !clientele
  ) {
    console.log("missing parameters when creating new post");
    return false;
  }

  return await sequelize
    .sync()
    .then(async () => {
      return await posts
        .create({
          user_id_link: userId,
          restaurant_name: name,
          restaurant_address: address,
          weekday_tips: weekdayTips,
          weekend_tips: weekendTips,
          work_environment: workenv,
          management: management,
          clientele: clientele,
          title: title,
          comment: comment,
        })
        .then((res) => {
          if (res) {
            console.log("new post saved successfully ", res);
            return res;
          } else {
            console.log("unable to save new post ", res);
            return false;
          }
        })
        .catch((error) => {
          console.log("error when trying to save new post ", error);
          return false;
        });
    })
    .catch((error) => {
      console.log("error on sync with new post database ", error);
    });
}
