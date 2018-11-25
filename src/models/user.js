const conn = require('../db');

const availableUsersSql = `
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

class User {
  static async getAvailableUsers() {
    try {
      return await conn.query(availableUsersSql);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
