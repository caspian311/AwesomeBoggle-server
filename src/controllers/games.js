const app = require('express').Router();

const Authenticator = require('../authenticator');
const Game = require('../models/game');
import Invitation from '../models/invitation';

app.post('/', Authenticator.auth, createGame);
app.put('/:gameId', Authenticator.auth, completeGame);
app.get('/:gameId', Authenticator.auth, getGame);
app.post('/:gameId/invitations', Authenticator.auth, inviteOpponents);

async function createGame(req, res) {
  let gameMembers = req.body["userIds"];

  try {
    let game = await Game.createGame(gameMembers);
    game['isReady'] = false;
    res.json(game);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
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
    res.sendStatus(500);
  }
}

async function getGame(req, res) {
  let gameId = req.params["gameId"];

  try {
    let game = await Game.getGame(gameId);
    if (game) {
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function inviteOpponents(req, res) {
  let gameId = req.params['gameId'];
  let opponentUserIds = req.body['userIds'];

  let game = await Game.getGame(gameId);
  console.log("using gameId: " + gameId)

  if (game) {
    Invitation.inviteOpponents(gameId, opponentUserIds);
    let invitations = await Invitation.findByGameId(gameId);
    res.send(invitations);
  } else {
    console.log("looked for game: " + gameId + ", but couldn't find it");
    res.sendStatus(404);
  }
}


module.exports = app;
