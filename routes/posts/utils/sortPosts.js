import { toNumber, haversineDistance } from "./haversineDistance.js";

export default function sortPosts(posts, parsedUserLong, parsedUserLat) {
  if (!posts) return false;

  const postsWD = posts.map((post) => {
    console.log("this is post inside postswithdistance map: ", post);
    const postData = post.get({ plain: true });
    delete postData.deletedAt;
    delete postData.post_id;
    delete postData.updatedAt;
    delete postData.user_id_link;
    const postLong = toNumber(postData.longitude);
    const postLat = toNumber(postData.latitude);
    const distance =
      Number.isNaN(postLong) || Number.isNaN(postLat)
        ? null
        : haversineDistance(parsedUserLat, parsedUserLong, postLat, postLong);

    return {
      ...postData,
      distance,
    };
  });

  postsWD.sort((a, b) => {
    if (a.distance === null && b.distance === null) return 0;
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });

  return postsWD;
}
