const app = require('express').Router();

app.post('/', register);

async function register(req, res) {
  res.send(200);
}

module.exports = app;
