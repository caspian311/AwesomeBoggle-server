const app = require('express').Router();

const Authenticator = require('../authenticator');
const User = require('../models/user');

app.get('/', Authenticator.auth, availableUsers);
app.get('/:username', checkUsernameAvailability);
app.post('/', register);

async function availableUsers(req, res) {
  let currentUserId = req.user.id;

  try {
    let users = await User.getAvailableUsers(currentUserId);
    res.json(users);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function checkUsernameAvailability(req, res) {
  const username = req.params.username;
  try {
    let user = await User.findByUsername(username);

    if (user) {
      res.status(409);
      res.json({
        isAvailable: false
      });
    } else {
      res.json({
        isAvailable: true
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function register(req, res) {
  let username = req.body["username"];

  try {
    var user = await User.findByUsername(username);
    if (user) {
      res.status(409);
      res.json({
        message: "Username is not available."
      });
    } else {
      user = await User.create(username);
      res.json(user);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

module.exports = app;
