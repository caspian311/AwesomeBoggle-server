const conn = require('../db');

class User {
  static getAvailableUsers() {
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
    return new Promise((resolve, reject) => {
      conn.query(sql, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = User;
