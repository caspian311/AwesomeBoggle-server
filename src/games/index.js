const app = require('express').Router();

const conn = require('../db');

app.post('/', (req, res) => {
  let gameMembers = req.body["user_ids"];

  let createGameSql = `
    INSERT INTO games (created_on, finished)
      values (NOW(), 0)
  `;
  conn.query(createGameSql, (err, results) => {
    if (err) {
      throw err;
    }

    let gameId = results.insertId;

    let createScore = `INSERT INTO scores (game_id, user_id, score) VALUES ?`;
    let scoreData = gameMembers.map(memberId => [gameId, memberId, 0]);
    conn.query(createScore, [scoreData], (err, results) => {
      if (err) {
        throw err;
      }

      res.json({ game: { id: gameId } })
    });
  });
});

app.put('/:gameId', (req, res) => {
  let gameId = req.params.gameId;

  let userId = req.body["score"]["userId"];
  let score = req.body["score"]["score"];

  let updateScoreSql = `
    UPDATE scores
    SET score = ?
    WHERE game_id = ?
    AND user_id = ?
  `;
  conn.query(updateScoreSql, [ score, gameId, userId ], (err, results) => {
    if (err) {
      throw err;
    }

    let updateGameSql = `
      UPDATE games
      SET finished = 1
      WHERE id = ?
    `;
    conn.query(updateGameSql, [ gameId ], (err, results) => {
      if (err) {
        throw err;
      }

      let getGameSql = `
        SELECT g.id as gameId, u.id as userId, u.username as username, s.score as score
        FROM games g, users u, scores s
        WHERE g.id = s.game_id
        AND u.id = s.user_id
        AND g.id = ?
      `;
      conn.query(getGameSql, [ gameId ], (err, results) => {
        if (err) {
          throw err;
        }

        res.json(results)
      });
    });
  });
});

app.get('/:gameId', (req, res) => {
  let gameId = req.params["gameId"]

  let getGameSql = `
    SELECT g.id as gameId, g.finished as finished, g.created_on as created_on,
      u.id as userId, u.username as username,
      s.score as score
    FROM games g, users u, scores s
    WHERE g.id = s.game_id
    AND u.id = s.user_id
    AND g.id = ?
  `;
  conn.query(getGameSql, [ gameId ], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length === 0) {
      res.json([]);
    }

    let game = {
      id: results[0].gameId,
      finished: results[0].finished,
      scores: results.map((score) => {
        return { userId: score.userId, username: score.username, score: score.score };
      })
    };
    res.json(game)
  });
});

module.exports = app;
