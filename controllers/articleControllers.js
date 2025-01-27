const {fetchArticlebyID} = require("../models/articleModels.js");

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

module.exports = {getArticlebyID};