const conn = require('../db');
import GameMaker from './gameMaker'

const createScore = `INSERT INTO scores (game_id, user_id, score) VALUES ?`;
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
// const getGameSql = `
//   SELECT g.id as gameId, g.finished as finished, g.created_on as created_on,
//     u.id as userId, u.username as username,
//     s.score as score
//   FROM games g, users u, scores s
//   WHERE g.id = s.game_id
//   AND u.id = s.user_id
//   AND g.id = ?
// `;
const getGameSql = `
  SELECT g.id as gameId, g.grid as grid
  FROM games g
  WHERE g.id = ?
`;


class Game {
  static async createGame(gameMembers) {
    const grid = new GameMaker().generateGrid();

    let createdGameResults = await conn.query(createGameSql, grid);

    let gameId = createdGameResults.insertId;
    // let scoreData = gameMembers.map(memberId => [gameId, memberId, 0]);
    //
    // await conn.query(createScore, [scoreData]);

    return { gameId: gameId, grid: grid };
  }

  static async completeGame(gameId, userId, score) {
    await conn.query(updateScoreSql, [ score, gameId, userId ]);
    await conn.query(updateGameSql, [ gameId ]);
    return await conn.query(getGameSql, [ gameId ]);
  }

  static async getGame(gameId) {
    let results = await conn.query(getGameSql, gameId);
    if (results.length === 0) {
      return null;
    }

    return {
      id: results[0].gameId,
      grid: results[0].grid,
      isReady: false
    };
  }
}

module.exports = Game;
