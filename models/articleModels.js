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

function fetchArticles(sort_by = "created_at", order = "desc") {
  const allowedSortBy = ["title", "topic", "author", "created_at", "votes"];
  const allowedOrder = ["desc", "asc"];
  if(!allowedSortBy.includes(sort_by) || !allowedOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: 'Cannot be sorted based on this criteria'
    });
  }
  return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.comment_id)
    ::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order.toUpperCase()};
    `)
  .then((result) => {
    return result.rows;
  })
}

function insertVotes({inc_votes}, article_id) {
  return db
  .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
  .then((article) => {
    return article.rows[0];
  })
}

module.exports = {fetchArticlebyID, fetchArticles, insertVotes};