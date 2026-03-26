import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseName = process.env.DATABASE_NAME;
const databaseUsername = process.env.DATABASE_USERNAME;
const databaseHost = process.env.DATABASE_HOST;
const databasePassword = process.env.DATABASE_PASSWORD;

/**
 * connect to database via sequelize
 */
export const sequelize = new Sequelize({
  dialect: "mariadb",
  database: databaseName,
  username: databaseUsername,
  password: databasePassword,
  host: databaseHost,
  dialectOptions: {
    allowPublicKeyRetrieval: true,
    multipleStatements: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.log("unable to connect", error);
  });
