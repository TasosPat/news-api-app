const {fetchCommentsByArticleID, insertCommentToArticle} = require("../models/commentModels.js");
const {fetchArticlebyID} = require("../models/articleModels.js");

function getCommentsByArticleID(req, res, next) {
    const {article_id} = req.params;
    fetchArticlebyID(article_id)
    .then(() => {
        return fetchCommentsByArticleID(article_id)
    })
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
    })
}

function addCommentToArticle(req, res, next) {
    const newComment = req.body;
    const {article_id} = req.params;
    insertCommentToArticle(newComment, article_id).then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {getCommentsByArticleID, addCommentToArticle};