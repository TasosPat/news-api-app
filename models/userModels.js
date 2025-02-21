const db = require('../db/connection');

function fetchUsers() {
    return db.query(`
        SELECT * FROM users;
        `)
      .then((result) => {
        return result.rows;
      })
}

function fetchUserByUsername(username) {
  return db.query(`
    SELECT * FROM users WHERE username = $1;
    `, [username])
  .then((result) => {
    if (!result.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: `Username ${username} doesn't exist`
      });
    }
    return result.rows[0];
  })
}

module.exports = {fetchUsers, fetchUserByUsername};