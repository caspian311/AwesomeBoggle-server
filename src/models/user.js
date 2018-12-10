const uuid = require('uuid/v1');

const conn = require('../db');

const availableUsersSql = `
  SELECT u.id as id, u.username as username
  FROM users u
  WHERE u.id NOT IN (
    SELECT u.id
    FROM users u, games g, scores s
    WHERE s.game_id = g.id
    AND s.user_id = u.id
    AND g.finished = 0
  )
  AND u.id NOT IN (?)
`;
const usernameAvailabilitySql = `
  SELECT u.id as id, u.username as username, u.auth_token as authToken
  FROM users u
  WHERE u.username = ?
`;
const createUserSql = `
  INSERT INTO users (username, auth_token, created_on)
    VALUES (?, ?, NOW())
`;
const userByApiKeySql = `
  SELECT *
  FROM users u
  WHERE u.auth_token = ?
`;

class User {
  static async getAvailableUsers(currentUserId) {
    try {
      return await conn.query(availableUsersSql, currentUserId);
    } catch (err) {
      throw err;
    }
  }

  static async findByUsername(username) {
    let results = await conn.query(usernameAvailabilitySql, username);

    if (results.length === 0) {
      return null;
    } else {
      return results[0];
    }
  }

  static async create(username) {
    let authToken = uuid();

    let results = await conn.query(createUserSql, [username, authToken]);
    let userId = results.insertId;

    return {
      id: userId,
      username: username,
      auth_token: authToken
    };
  }

  static async findByApiKey(apiKey) {
    let results = await conn.query(userByApiKeySql, apiKey);

    if (results.length === 0) {
      return null;
    }

    return results[0];
  }
}

module.exports = User;
