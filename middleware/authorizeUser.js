import { getUserById } from "../database/users.database.js";
import jwt from "jsonwebtoken";

const tokenSecret = process.env.USER_TOKEN_SECRET;

export default async function authorizeUser(req, res, next) {
  const token = req.cookies.userToken ? req.cookies.userToken : null;

  if (token) {
    jwt.verify(token, tokenSecret, async (error, decodedToken) => {
      if (error) {
        console.log("Unable to authorize user ", error);
        res.user = null;
        return res.status(401).send("UNAUTHORIZED");
      }

      const user = await getUserById(decodedToken.userId);
      req.user = user;
      next();
    });
  } else {
    req.user = null;
    return res.status(403).send("FORBIDDEN");
  }
}
