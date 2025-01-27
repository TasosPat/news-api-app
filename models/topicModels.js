const db = require('../db/connection');

function fetchTopics() {
    return db.query('SELECT * FROM topics;').then((result) => {
        return result.rows;
      });
}

function insertTopic({slug, description}) {
    return db
    .query(
      'INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;',
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = {fetchTopics, insertTopic};