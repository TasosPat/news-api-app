const {fetchArticlebyID, fetchArticles, insertVotes} = require("../models/articleModels.js");

function getArticlebyID(req, res, next) {
    const {article_id} = req.params;
    fetchArticlebyID(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
    })
}

function getArticles(req, res, next) {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  fetchArticles(sort_by, order)
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => {
    console.log(err);
    next(err);
  })
}

function updateVotes(req, res, next) {
  const newVotes = req.body;
  const {article_id} = req.params;
  fetchArticlebyID(article_id)
  .then(() => {
    return insertVotes(newVotes ,article_id)
  })
  .then((article) => {
    res.status(200).send({ article })
  })
  .catch((err) => {
    next(err);
  })
}

module.exports = {getArticlebyID, getArticles, updateVotes};