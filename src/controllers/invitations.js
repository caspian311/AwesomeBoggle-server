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
    let invitations = await Invitation.findByGameId(gameId);
    res.send(invitations);
  } else {
    console.log("looked for game: " + gameId + ", but couldn't find it");
    res.sendStatus(404);
  }
}

module.exports = app;
