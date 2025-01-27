const endpoints = require("../endpoints.json");

function getDoc(req, res) {
    res.status(200).send({endpoints});
}

module.exports = getDoc;