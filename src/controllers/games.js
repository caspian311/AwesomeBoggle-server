const app = require('express').Router();

const Authenticator = require('../authenticator');
const Game = require('../models/game');

app.post('/', Authenticator.auth, createGame);
app.put('/:gameId', Authenticator.auth, completeGame);
app.get('/:gameId', Authenticator.auth, getGame);

async function createGame(req, res) {
  let gameMembers = req.body["userIds"];

  try {
    let game = await Game.createGame(gameMembers);
    res.json(game);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
}

async function completeGame(req, res) {
  let gameId = req.params.gameId;
  let userId = req.user.id;
  let score = req.body["score"]["score"];

  try {
    let game = await Game.completeGame(gameId, userId, score);
    res.json(game)
  } catch(err) {
    console.log(err);
    res.send(500);
  }
}

async function getGame(req, res) {
  let gameId = req.params["gameId"];

  try {
    let game = await Game.getGame(gameId);
    res.json(game);
  } catch(err) {
    console.log(err);
    res.send(500);
  }
}

module.exports = app;
