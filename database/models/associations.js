import { posts } from "./posts.model.js";
import { avgPosts } from "./avgPosts.model.js";

// Define associations
posts.belongsTo(avgPosts, {
  foreignKey: "average_id_link",
  as: "averages",
});

avgPosts.hasMany(posts, {
  foreignKey: "average_id_link",
  as: "posts",
});

export { posts, avgPosts };
