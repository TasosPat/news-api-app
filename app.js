const express = require('express');
const cors = require('cors');
const app = express();
const getDoc = require("./controllers/getDoc.js");
const {getTopics} = require("./controllers/topicControllers.js");
const { getArticlebyID, getArticles, updateVotes } = require('./controllers/articleControllers.js');
const { getCommentsByArticleID, addCommentToArticle, deleteCommentByID } = require('./controllers/commentControllers.js');
const {getUsers, getUserByUsername} = require('./controllers/userControllers.js');

app.use(cors());

app.use(express.json());

app.get('/api', getDoc);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlebyID);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

app.post('/api/articles/:article_id/comments', addCommentToArticle);

app.patch('/api/articles/:article_id', updateVotes);

app.delete('/api/comments/:comment_id', deleteCommentByID);

app.get('/api/users', getUsers);

app.get('/api/users/:username', getUserByUsername);

app.use((err, req, res, next) => {
    if(err.code === "22P02" || err.code === "23502") {
      res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
  });

  app.use((err, req, res, next) => {
    if(err.code === "23503") {
      res.status(404).send({ msg: "User doesn't exist" });
    } else next(err);
  });

  app.use((err, req, res, next) => {
    if(err.status && err.msg) {
      res.status(err.status).send({msg: err.msg});
    } else next(err);
  });

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Server Error!"});
  });

module.exports = app;