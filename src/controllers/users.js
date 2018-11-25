const app = require('express').Router();
const User = require('../models/user');

app.get('/', availableUsers);
app.get('/:username', checkUsernameAvailability);

async function availableUsers(req, res) {
  try {
    let users = await User.getAvailableUsers();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function checkUsernameAvailability(req, res) {
  const username = req.params.username;
  try {
    let user = await User.findByUsername(username);

    if (user) {
      res.status(409);
      res.json({
        message: "Username is not available."
      });
    } else {
      res.json({
        message: "Username is available."
      });
    }
  } catch (err) {
    res.status(500);
  }
}

module.exports = app;
