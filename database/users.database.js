import { sequelize } from './models/connect.js';
import { user } from './models/users.model.js';

/**
 * save created user to database
 *
 * @param {string} email
 * @param {string} username
 * @param {string} password
 *
 * @returns {object} if user is created successfully
 * @returns {false} if user could not be created
 * @returns {null} if parameters are missing or couldn't sync to database
 */
export function createUser(email, username, password) {
  if (!email || !username || !password) return null;

  return sequelize
    .sync()
    .then(() => {
      return user
        .create({
          email: email,
          username: username,
          password: password,
        })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          console.log('\n could not create new user \n');
          console.log(error);
          return false;
        });
    })
    .catch((error) => {
      console.log('\n could not sync with database \n');
      console.log(error);
      return null;
    });
}

/**
 * finds user by email
 *
 * @param {string} email
 *
 * @returns {Promise<Object>} object of user if email exists, returns null if no email is given or cant sync to database. returns false if no user is found
 */
export async function findUserByEmail(email) {
  if (!email) return null;

  return await sequelize
    .sync()
    .then(async () => {
      return await user
        .findOne({ where: { email: `${email}` } })
        .then((res) => {
          if (res) {
            return res;
          } else {
            return false;
          }
        })
        .catch((error) => {
          return false;
        });
    })
    .catch((error) => {
      console.log(
        'trouble syncing with database when looking for email',
        error
      );
      return null;
    });
}

/**
 * finds user by username
 *
 *
 * @param {string} username
 *
 * @returns {Promise<object>} object of user if username exists, null if no username given or can't sync to database, false if no user found
 */
export async function findUserByUsername(username) {
  if (!username) return null;

  return await sequelize
    .sync()
    .then(async () => {
      return await user
        .findOne({ where: { username: `${username}` } })
        .then((res) => {
          if (res) {
            return res;
          } else return false;
        })
        .catch((error) => {
          console.log('error while finding user by username', error);
          return false;
        });
    })
    .catch((error) => {
      console.log(
        'trouble syncing with database when looking for username',
        error
      );
      return null;
    });
}
