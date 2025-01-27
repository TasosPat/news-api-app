const express = require('express');
const app = express();
const getDoc = require("./controllers/getDoc.js")

app.use(express.json());

app.get('/api', getDoc);

module.exports = app;