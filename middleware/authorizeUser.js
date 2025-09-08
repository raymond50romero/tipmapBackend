import { getUserById } from "../database/users.database.js";
import jwt from "jsonwebtoken";

const tokenSecret = process.env.USER_TOKEN_SECRET;

export default async function authorizeUser(req, res, next) {
  const token = req.cookies.userToken ? req.cookies.userToken : null;
  const tokenCookie = req.query.cookie ? req.query.cookie : null;

  if (tokenCookie) {
    const tokenCookieVerify = await jwtVerify(tokenCookie);
    if (tokenCookieVerify) {
      req.user = tokenCookieVerify;
      next();
    } else {
      console.log("Cannot authorize user");
      res.user = null;
      return res.status(401).send("UNAUTHORIZED");
    }
  } else if (token) {
    const tokenVerify = await jwtVerify(token);
    if (tokenVerify) {
      req.user = tokenVerify;
      next();
    } else {
      console.log("Cannot authorize user");
      res.user = null;
      return res.status(401).send("UNAUTHORIZED");
    }
  } else {
    req.user = null;
    return res.status(403).send("FORBIDDEN");
  }
}

/*******************************
 *                             *
 *      HELPER FUNCTIONS       *
 *                             *
 *******************************/

async function jwtVerify(token) {
  if (!token) return null;

  jwt.verify(token, tokenSecret, async (error, decodedToken) => {
    if (error) {
      return false;
    } else {
      return await getUserById(decodedToken.userId);
    }
  });
}
