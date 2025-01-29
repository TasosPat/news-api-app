const {fetchCommentsByArticleID} = require("../models/commentModels.js");

function getCommentsByArticleID(req, res, next) {
    const {article_id} = req.params;
    fetchCommentsByArticleID(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {getCommentsByArticleID};