'use strict';
/**
 * Created by giang.nguyen on 03/29/17.
 *
 */
module.exports = {
  checkObjectId
};

/**
 * Ensure the id is valid
 * @param {*} id
 */
function checkObjectId(id) {
  return new Promise((resolve, reject) => {
    const res = id.match(/^$|[0-9a-fA-F]{24}$/);
    if (res) {
      resolve(res[0]);
    } else {
      reject({ code: 100, message: 'invalid id' });
    }
  });
}
