const app = require('express').Router();

import Authenticator from '../authenticator';
import Game from '../models/game';
import Invitation from '../models/invitation';

app.post('/', Authenticator.auth, inviteOpponents);

async function inviteOpponents(req, res) {
  let gameId = req.body['gameId'];
  let opponentUserId = req.body['userId'];

  let game = await Game.getGame(gameId);

  if (game) {
    Invitation.inviteOpponent(gameId, opponentUserId);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
}

module.exports = app;
