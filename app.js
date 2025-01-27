const express = require('express');
const app = express();
const getDoc = require("./controllers/getDoc.js");
const {getTopics, postTopic} = require("./controllers/topicControllers.js");

app.use(express.json());

app.get('/api', getDoc);

app.get('/api/topics', getTopics);

app.post('/api/topics', postTopic);

app.use((err, req, res, next) => {
    if(err.code === "23502" || err.code === '22P02') {
      res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
  });

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Server Error!"});
  });

module.exports = app;