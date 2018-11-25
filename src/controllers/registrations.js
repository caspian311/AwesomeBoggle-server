const app = require('express').Router();

const User = require('../models/user');

app.post('/', register);

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
    res.send(500);
  }
}

module.exports = app;
