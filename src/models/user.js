const uuid = require('uuid/v1');

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
const usernameAvailabilitySql = `
  SELECT *
  FROM users u
  WHERE u.username = ?
`;
const createUserSql = `
  INSERT INTO users (username, auth_token, created_on)
    VALUES (?, ?, NOW())
`;

class User {
  static async getAvailableUsers() {
    try {
      return await conn.query(availableUsersSql);
    } catch (err) {
      throw err;
    }
  }

  static async findByUsername(username) {
    try {
      let results = await conn.query(usernameAvailabilitySql, username);

      if (results.length === 0) {
        return null;
      } else {
        return results[0];
      }
    } catch (err) {
      throw new err;
    }
  }

  static async create(username) {
    let authToken = uuid();

    try {
      let results = await conn.query(createUserSql, [username, authToken]);
      let userId = results.insertId;

      return {
        userId: userId,
        username: username,
        authToken: authToken
      };
    } catch (err) {
      throw new err;
    }
  }
}

module.exports = User;
