const app = require('express').Router();

const conn = require('../db');
const Game = require('./game');

app.post('/', (req, res) => {
  let gameMembers = req.body["user_ids"];
  Game.createGame(gameMembers).then((game) => {
    res.json(game);
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

app.put('/:gameId', (req, res) => {
  let gameId = req.params.gameId;
  let userId = req.body["score"]["userId"];
  let score = req.body["score"]["score"];

  Game.completeGame(gameId, userId, score).then((game) => {
    res.json(game)
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

app.get('/:gameId', (req, res) => {
  let gameId = req.params["gameId"]

  Game.getGame(gameId).then((game) => {
    res.json(game);
  }).catch((err) => {
    console.log(err);
    res.status(500);
  });
});

module.exports = app;
