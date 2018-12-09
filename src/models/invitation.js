const conn = require('../db');

const createInvitationSQL = `
  INSERT INTO
    invitations (game_id, user_id)
    VALUES (?, ?)
`;
const allInvitationsSQL = `
  SELECT game_id, user_id
  FROM invitations
`;

class Invitation {
  static async getAll() {
    let allInvitations = await conn.query(allInvitationsSQL);

    return allInvitations;
  }

  static async inviteOpponent(gameId, userId) {
    let invite = await conn.query(createInvitationSQL, [ gameId, userId ]);
    console.log(invite);
  }
}

module.exports = Invitation;
