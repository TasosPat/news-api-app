const db = require('../db/connection');

function fetchArticlebyID(article_id) {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`
        });
      }
      return result.rows[0];
    });
}

function fetchArticles() {
  return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.comment_id)
    ::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `)
  .then((result) => {
    return result.rows;
  })
}

module.exports = {fetchArticlebyID, fetchArticles};