const express = require('express');
const app = express();
const getDoc = require("./controllers/getDoc.js");
const {getTopics} = require("./controllers/topicControllers.js");
const { getArticlebyID, getArticles } = require('./controllers/articleControllers.js');

app.use(express.json());

app.get('/api', getDoc);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlebyID);

app.get('/api/articles', getArticles);

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
      res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
  });

  app.use((err, req, res, next) => {
    if(err.status && err.msg) {
      res.status(err.status).send({msg: err.msg});
    } else next(err);
  });

  app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Server Error!"});
  });

module.exports = app;