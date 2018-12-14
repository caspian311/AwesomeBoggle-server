import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';
import User from '../src/models/user';

describe('invitations', () => {
  var testGameId = 0;
  var testUser = null;

  beforeEach(async () => {
    await User.deleteAll();
    await Game.deleteAll();
    testUser = await User.create('test_user');
    return Game.createGame().then((game) => {
      testGameId = game.gameId;
    })
  });

  describe('POST /games/:gameId/invitations', () => {
    describe('unauthorized requests', () => {
      it('should return a bad request', () => {
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .send({
            userIds: [testUser.id]
          })
          .expect(401);
      });
    });

    describe('for invalid games', () => {
      it('should return an error', () => {
        return request(app).post('/api/v1.0/games/12345/invitations')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ '9999' ]
          })
          .expect(404);
      });
    });

    describe('for valid games', () => {
      it('should return a success', () => {
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ testUser.id ]
          })
          .expect(200);
      });

      it('should create an invitation', async () => {
        let originalInvitations = await Invitation.getAll();
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ testUser.id ]
          })
          .then(async () => {
            let currentInvitations = await Invitation.getAll();
            expect(currentInvitations.length).toBeGreaterThan(originalInvitations.length);
          });
      });

      it('should return the invitations', async () => {
        let testUser2 = await User.create('other_user');
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ testUser.id, testUser2.id ]
          })
          .expect([
            { gameId: testGameId, userId: testUser.id, username: testUser.username, accepted: 0 },
            { gameId: testGameId, userId: testUser2.id, username: testUser2.username, accepted: 0 }
          ]);
      });
    });
  });

  describe('PUT /games/:gameId/invitations', () => {
    describe('unauthenticated requests', () => {
      it('should return a bad request', () => {
        return request(app).put(`/api/v1.0/games/${testGameId}/invitations`)
          .expect(401);
      });
    });

    describe('authenticated requests', () => {
      describe('for games that don\'t exist', () => {
        it('should return a bad request', () => {
          return request(app).put('/api/v1.0/games/998877/invitations')
            .set('Authorization', `Api-Key ${testUser.authToken}`)
            .expect(404);
        });
      });

      describe('for games that you aren\'t invited to', () => {
        it('should return a bad request', () => {
          return request(app).put(`/api/v1.0/games/${testGameId}/invitations`)
            .set('Authorization', `Api-Key ${testUser.authToken}`)
            .expect(404);
        });
      })
    });

    describe('valid games with invites', () => {
      it('should return a success', async () => {
        await Invitation.inviteOpponents(testGameId, [testUser.id]);
        return request(app).put(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(200);
      });

      it('should mark the invite as accepted', async () => {
        await Invitation.inviteOpponents(testGameId, [testUser.id]);
        await request(app).put(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`);
        let invites = await Invitation.findByGameId(testGameId);
        let invite = invites.filter(invite => invite.userId === testUser.id)[0]
        expect(invite.accepted).toBe(1);
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
