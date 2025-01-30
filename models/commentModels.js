const db = require('../db/connection');

function fetchCommentsByArticleID(article_id) {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1
            ORDER BY created_at DESC;
      `, [article_id])
  .then(({ rows }) => {
    return rows;
  })
  }

  function insertCommentToArticle({username, body}, article_id) {
    return db
    .query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;', [username, body, article_id])
    .then(({ rows }) => {
      return rows[0];
    })
  }

  function removeCommentByID(comment_id) {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1;', [comment_id]);
  }

  function fetchCommentbyID(comment_id) {
    return db
    .query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${comment_id}`
        });
      }
      return result.rows[0];
    });
}
  
  module.exports = {fetchCommentsByArticleID, insertCommentToArticle, removeCommentByID, fetchCommentbyID};