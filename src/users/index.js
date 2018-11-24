const app = require('express').Router();
const conn = require('../db');
const User = require('./user');

app.get('/', availableUsers);

async function availableUsers(req, res) {
  try {
    let users = await User.getAvailableUsers();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500);
  };
}

module.exports = app;
