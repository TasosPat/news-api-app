const {fetchUsers, fetchUserByUsername} = require("../models/userModels.js");

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

function getUserByUsername (req, res, next) {
    const { username } = req.params;
    fetchUserByUsername(username)
    .then((user) => {
        res.status(200).send({ user });
    })
    .catch((err) => {
        console.log(err);
        next(err);
      }) 
}

module.exports = {getUsers, getUserByUsername};