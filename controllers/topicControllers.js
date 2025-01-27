const {fetchTopics, insertTopic} = require("../models/topicModels.js");

function getTopics(req, res, next) {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
}

function postTopic(req, res, next) {
    const newTopic = req.body;
    insertTopic(newTopic)
    .then((topic) => {
        // console.log(topic);
        res.status(201).send({ topic });
    })
    .catch((err) => {
        // console.log(err);
       next(err); 
    })
}
module.exports = {getTopics, postTopic};