const app = require('express').Router();
const conn = require('../db');

app.get('/', (req, res) => {
  let sql = `
    SELECT u.*
    FROM users u
    WHERE u.id NOT IN (
      SELECT u.id
      FROM users u, games g, scores s
      WHERE s.game_id = g.id
      AND s.user_id = u.id
      AND g.finished = 0
    )
  `;
  conn.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

module.exports = app;
