const uuid = require('uuid/v1');

const conn = require('../db');

const availableUsersSql = `
  SELECT u.id as id, u.username as username
  FROM users u
  WHERE u.id NOT IN (
    SELECT u.id
    FROM invitations i, users u, games g
    WHERE i.user_id = u.id
    AND g.id = i.game_id
    AND i.accepted = 1
    AND g.finished = 0
  )
  AND u.id NOT IN (?)
  ORDER BY id
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
const deleteUserSQL = `
  DELETE FROM users;
`;

class User {
  static async deleteAll() {
    return await conn.query(deleteUserSQL);
  }

  static async getAvailableUsers(currentUserId) {
    return await conn.query(availableUsersSql, currentUserId);
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
      authToken: authToken
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
