import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseName = process.env.DATABASE_NAME;
const databaseUsername = process.env.DATABASE_USERNAME;
const databaseHost = process.env.DATABASE_HOST;
const databasePassword = process.env.DATABASE_PASSWORD;

/*
 *
 * mysql connect
 *
export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  { host: process.env.DATABASE_HOST, dialect: "mysql" },
);
*/

export const sequelize = new Sequelize({
  dialect: "mariadb",
  database: databaseName,
  user: databaseUsername,
  password: databasePassword,
  host: databaseHost,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("it synced");
  })
  .catch((error) => {
    console.log("unable to connect", error);
  });
