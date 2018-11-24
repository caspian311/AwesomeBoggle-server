const app = require('express').Router();
const conn = require('../db');
const User = require('./user');

app.get('/', (req, res) => {
  User.getAvailableUsers().then((users) => {
    res.json(users);
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

module.exports = app;
