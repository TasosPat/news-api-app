const {fetchUsers} = require("../models/userModels.js");

function getUsers(req, res, next) {
    fetchUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch((err) => {
        console.log(err);
        next(err);
      })
}

module.exports = {getUsers};