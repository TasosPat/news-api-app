const {fetchArticlebyID, fetchArticles} = require("../models/articleModels.js");

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
  fetchArticles()
  .then((articles) => {
    console.log(articles);
    res.status(200).send({ articles });
  })
  .catch((err) => {
    console.log(err);
    next(err);
  })
}

module.exports = {getArticlebyID, getArticles};