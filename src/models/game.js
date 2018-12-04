const conn = require('../db');

const createScore = `INSERT INTO scores (game_id, user_id, score) VALUES ?`;
const createGameSql = `
INSERT INTO games (created_on, finished)
values (NOW(), 0)
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
  SELECT g.id as gameId, g.finished as finished, g.created_on as created_on,
    u.id as userId, u.username as username,
    s.score as score
  FROM games g, users u, scores s
  WHERE g.id = s.game_id
  AND u.id = s.user_id
  AND g.id = ?
`;


class Game {
  static async createGame(gameMembers) {
    try{
      let createdGameResults = await conn.query(createGameSql);

      let gameId = createdGameResults.insertId;
      let scoreData = gameMembers.map(memberId => [gameId, memberId, 0]);

      await conn.query(createScore, [scoreData]);

      return { game: { gameId: gameId } };
    } catch(err) {
      throw err;
    }
  }

  static async completeGame(gameId, userId, score) {
    try {
      await conn.query(updateScoreSql, [ score, gameId, userId ]);
      await conn.query(updateGameSql, [ gameId ]);
      return await conn.query(getGameSql, [ gameId ]);
    } catch(err) {
      throw err;
    }
  }

  static async getGame(gameId) {
    try {
      let results = await conn.query(getGameSql, [ gameId ]);
      if (results.length === 0) {
        return {};
      }

      return {
        id: results[0].gameId,
        finished: results[0].finished,
        scores: results.map((score) => {
          return { userId: score.userId, username: score.username, score: score.score };
        })
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Game;
