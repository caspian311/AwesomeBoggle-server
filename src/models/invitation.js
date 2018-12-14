const conn = require('../db');

const createInvitationSQL = `
  INSERT INTO
    invitations (game_id, user_id)
    VALUES ?
`;
const allInvitationsSQL = `
  SELECT game_id as gameId, user_id as userId
  FROM invitations
`;
const invitationsForGameSQL = `
  SELECT i.game_id as gameId,
    i.user_id as userId, u.username as username,
    i.accepted as accepted
  FROM invitations i, users u
  WHERE u.id = i.user_id
  AND i.game_id = ?
  ORDER BY gameId, userId
`;
const acceptInvitationSQL = `
  UPDATE invitations
  SET ACCEPTED = 1
  WHERE game_id = ?
  AND user_id = ?
`;

class Invitation {
  static async getAll() {
    let allInvitations = await conn.query(allInvitationsSQL);

    return allInvitations;
  }

  static async inviteOpponents(gameId, userIds) {
    let scoreData = userIds.map(userId => [ gameId, userId ]);

    return await conn.query(createInvitationSQL, [ scoreData ]);
  }

  static async findByGameId(gameId) {
    return await conn.query(invitationsForGameSQL, gameId);
  }

  static async accept(gameId, userId) {
    return await conn.query(acceptInvitationSQL, [ gameId, userId]);
  }
}

module.exports = Invitation;
