const app = require('express').Router();

const conn = require('../db');
const Game = require('./game');

app.post('/', createGame);
app.put('/:gameId', completeGame);
app.get('/:gameId', getGame);

async function createGame(req, res) {
  let gameMembers = req.body["user_ids"];
  
  try {
    let game = await Game.createGame(gameMembers);
    res.json(game);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function completeGame(req, res) {
  let gameId = req.params.gameId;
  let userId = req.body["score"]["userId"];
  let score = req.body["score"]["score"];

  try {
    let game = await Game.completeGame(gameId, userId, score);
    res.json(game)
  } catch(err) {
    console.log(err);
    res.status(500);
  }
}

async function getGame(req, res) {
  let gameId = req.params["gameId"];

  try {
    let game = await Game.getGame(gameId);
    res.json(game);
  } catch(err) {
    console.log(err);
    res.status(500);
  }
}

module.exports = app;
