const {fetchArticlebyID, fetchArticles, insertVotes} = require("../models/articleModels.js");
const {fetchTopics} = require("../models/topicModels.js");

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
  const topic = req.query.topic;
  if(topic) {
    fetchTopics()
    .then((topics) => {
      let count = 0;
     topics.forEach((element) =>{
      if(element.slug === topic) count++;
     })
      if(count===0) {
        return Promise.reject({
          status: 400,
          msg: `Topic doesn't exist`
        });
      }
      return fetchArticles(sort_by, order, topic);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    })
  }
  else {
  fetchArticles(sort_by, order, topic)
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => {
    next(err);
  })
}
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