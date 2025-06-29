import { sequelize } from './models/connect.js';
import { occupation } from './models/occupation.model.js';

/**
 * create new occupation list for user
 *
 * @param {Number} user_id
 * @param {Boolean} bartender
 * @param {Boolean} busser
 * @param {Boolean} host
 * @param {Boolean} takeout
 * @param {Boolean} server
 * @param {Boolean} support
 * @param {Boolean} management
 * @param {Boolean} boh
 * @param {Boolean} other
 * @returns {Promise<Object>} returns a promise of an obejct containing the completed input into the database.
 *  False if it could not input, null otherwise
 */
export async function createOccupation(
  user_id,
  bartender,
  busser,
  host,
  takeout,
  server,
  support,
  management,
  boh,
  other
) {
  if (!user_id) return null;

  return await sequelize.sync().then(async () => {
    return await occupation
      .create({
        user_id_link: user_id,
        bartender: bartender,
        busser: busser,
        host: host,
        takeout: takeout,
        server: server,
        support: support,
        management: management,
        boh: boh,
        other: other,
      })
      .then((res) => {
        if (res) {
          console.log('created occupation successful\n', res);
          return res;
        } else {
          console.log('unable to create occupation, res returned not true');
        }
      })
      .catch((error) => {
        console.log('occupation was not created\n', error);
        return false;
      })
      .catch((error) => {
        console.log('unable to sync to occupation database\n', error);
        return null;
      });
  });
}

/**
 * update occupations by user
 *
 * @param {Number} user_id
 * @param {Boolean} bartender
 * @param {Boolean} busser
 * @param {Boolean} host
 * @param {Boolean} takeout
 * @param {Boolean} server
 * @param {Boolean} management
 * @param {Boolean} other
 * @returns {Promise<Object>} returns an object that contains the result of updating database,
 *  null if no user id given or couldn't sync to database, false if update was unsucessful
 */
export async function updateOccupation(
  user_id,
  bartender,
  busser,
  host,
  takeout,
  server,
  management,
  other
) {
  if (!user_id) return null;

  return await sequelize
    .sync()
    .then(async () => {
      return await occupation
        .update(
          {
            bartender: bartender,
            busser: busser,
            host: host,
            takeout: takeout,
            server: server,
            management: management,
            other: other,
          },
          { where: { user_id_link: user_id } }
        )
        .then((res) => {
          if (res) {
            console.log('occupation update successful\n', res);
            return res;
          } else {
            console.log('unable to update occupation...\n', res);
            return false;
          }
        })
        .catch((error) => {
          console.log('error while updating occupaiton', error);
          return false;
        });
    })
    .catch((error) => {
      console.log(
        'unable to sync to database when updating occupation\n',
        error
      );
    });
}
