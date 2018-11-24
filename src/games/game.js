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
  static createGame(gameMembers) {
    return new Promise((resolve, reject) => {
      conn.query(createGameSql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          let gameId = results.insertId;
          let scoreData = gameMembers.map(memberId => [gameId, memberId, 0]);

          conn.query(createScore, [scoreData], (err, results) => {
            if (err) {
              reject(err);
            } else {
              let game = { game: { gameId: gameId } };
              resolve(game);
            }
          });
        }
      });
    });
  }

  static completeGame(gameId, userId, score) {
    return new Promise((resolve, reject) => {
      conn.query(updateScoreSql, [ score, gameId, userId ], (err, results) => {
        if (err) {
          reject(err);
        } else {
          conn.query(updateGameSql, [ gameId ], (err, results) => {
            if (err) {
              reject(err);
            } else {
              conn.query(getGameSql, [ gameId ], (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              });
            }
          });
        }
    });
    });
  }

  static getGame(gameId) {
    return new Promise((resolve, reject) => {
      conn.query(getGameSql, [ gameId ], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve({});
          } else {
            let game = {
              id: results[0].gameId,
              finished: results[0].finished,
              scores: results.map((score) => {
                return { userId: score.userId, username: score.username, score: score.score };
              })
            };
            resolve(game);
          }
        }
      });
    });
  }
}

module.exports = Game;
