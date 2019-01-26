const conn = require('../db');
import GameMaker from './gameMaker';
import Invitation from './invitation';

const createGameSql = `
  INSERT INTO
    games (grid, created_on, finished)
    VALUES (?, NOW(), 0)
`;
const createScoreSql = `
  INSERT INTO scores (score, game_id, user_id)
    VALUES (?, ?, ?)
`;
const updateGameSql = `
  UPDATE games
  SET finished = 1
  WHERE id = ?
`;
const getGameSql = `
  SELECT g.id as gameId, g.grid as grid
  FROM games g
  WHERE g.id = ?
`;
const deleteGamesSQL = `
  DELETE from games;
`;
const gameHistorySQL = `
  SELECT g.id, g.created_on as createdOn, u.id as userId, u.username, s.score
  FROM games g, scores s, users u
  WHERE g.finished = 1
  AND u.id = s.user_id
  AND s.game_id = g.id
  AND g.id IN (
    SELECT s2.game_id
    FROM scores s2
    WHERE s2.user_id = ?
  )
`;

class Game {
  static async allForUser(userId) {
    let forAll = await conn.query(gameHistorySQL, userId);
    return forAll.reduce((allGames, currentGame) => {
      let thing = allGames.find(game => game.id == currentGame.id);
      if (!thing) {
        thing = currentGame;
        allGames.push(thing);
      }
      thing.scores = (thing.scores || []);
      thing.scores.push({ username: currentGame.username, score: currentGame.score})
      delete thing['username'];
      delete thing['score'];
      delete thing['userId'];

      return allGames;
    }, []);
  }

  static async deleteAll() {
    return await conn.query(deleteGamesSQL);
  }

  static async create() {
    let grid = new GameMaker().generateGrid();

    let createdGameResults = await conn.query(createGameSql, grid);
    let gameId = createdGameResults.insertId;

    return { gameId: gameId, grid: grid };
  }

  static async complete(gameId, userId, score) {
    await conn.query(createScoreSql, [ score, gameId, userId ]);
    await conn.query(updateGameSql, [ gameId ]);
    return await conn.query(getGameSql, [ gameId ]);
  }

  static async getGame(gameId) {
    let games = await conn.query(getGameSql, gameId);
    if (games.length === 0) {
      return null;
    }
    let game = games[0];

    let invitations = await Invitation.findByGameId(gameId);

    return {
      id: game.gameId,
      grid: game.grid,
      isReady: invitations.length > 0 && invitations.every(invitation => invitation.accepted === 1)
    };
  }
}

module.exports = Game;
