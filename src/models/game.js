const conn = require('../db');
import GameMaker from './gameMaker';
import Invitation from './invitation';

const createGameSql = `
  INSERT INTO
    games (grid, created_on, finished)
    VALUES (?, NOW(), 0)
`;
const updateScoreSql = `
  UPDATE scores
  SET score = ?
  WHERE game_id = ?
  AND user_id = ?
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

class Game {
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
    await conn.query(updateScoreSql, [ score, gameId, userId ]);
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
