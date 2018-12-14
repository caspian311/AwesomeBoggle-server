const app = require('express').Router();

import Authenticator from '../authenticator';
import Game from '../models/game';
import Invitation from '../models/invitation';

app.post('/', Authenticator.auth, createGame);
app.put('/:gameId', Authenticator.auth, completeGame);
app.get('/:gameId', Authenticator.auth, getGame);
app.post('/:gameId/invitations', Authenticator.auth, inviteOpponents);
app.put('/:gameId/invitations', Authenticator.auth, acceptInvite);

async function createGame(req, res) {
  try {
    let game = await Game.create();
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
  let score = req.body["score"];

  let game = await Game.getGame(gameId);
  if (!game) {
    res.sendStatus(404);
    return;
  }

  try {
    let game = await Game.complete(gameId, userId, score);
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
  if (game == null) {
    res.sendStatus(404);
    return;
  }

  Invitation.inviteOpponents(gameId, opponentUserIds);
  let invitations = await Invitation.findByGameId(gameId);
  res.send(invitations);
}

async function acceptInvite(req, res) {
  let gameId = req.params['gameId'];
  let userId = req.user.id;

  let game = await Game.getGame(gameId);

  if (game == null) {
    res.sendStatus(404);
    return;
  }

  let invitesForGame = await Invitation.findByGameId(gameId);
  if (!invitesForGame.find(invite => invite.userId == userId)) {
    res.sendStatus(404);
    return;
  }

  await Invitation.accept(gameId, userId)
  res.sendStatus(200);
}

module.exports = app;
