import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';
import User from '../src/models/user';

describe('inventations', () => {
  var testGameId = 0;
  var testUser = null;

  beforeEach(() => {
    return Game.createGame().then((game) => {
      testGameId = game.gameId;
    });
  });

  beforeEach(() => {
    return User.findByUsername('matt').then(user => {
      testUser = user;
    });
  });

  describe('POST /games/:gameId/invitations', () => {
    describe('unauthorized requests', () => {
      it('should return a bad request', () => {
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .send({
            userId: 2
          })
          .then(response => {
            expect(response.statusCode).toBe(401);
          });
      });
    });

    describe('for invalid games', () => {
      it('should return an error', () => {
        return request(app).post('/api/v1.0/games/12345/invitations')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ '9999' ]
          })
          .then(response => {
            expect(response.statusCode).toBe(404);
          });
      });
    });

    describe('for valid games', () => {
      it('should return a success', () => {
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ '2' ]
          })
          .expect(200);
      });

      it('should create an invitation', async () => {
        let originalInvitations = await Invitation.getAll();
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ '2' ]
          })
          .then(async () => {
            let currentInvitations = await Invitation.getAll();
            expect(currentInvitations.length).toBeGreaterThan(originalInvitations.length);
          });
      });

      it('should return the invitation', async () => {
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({
            userIds: [ '2', '5' ]
          })
          .expect([
            { gameId: testGameId, userId: 2, username: 'abbi', accepted: 0 },
            { gameId: testGameId, userId: 5, username: 'peter', accepted: 0 }
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
      it('should return a success', () => {
        return Invitation.inviteOpponents(testGameId, [testUser.id]).then(() => {
          return request(app).put(`/api/v1.0/games/${testGameId}/invitations`)
            .set('Authorization', `Api-Key ${testUser.authToken}`)
            .expect(200);
        });
      });

      it('should mark the invite as accepted', (done) => {
        return Invitation.inviteOpponents(testGameId, [testUser.id]).then(() => {
          return request(app).put(`/api/v1.0/games/${testGameId}/invitations`)
            .set('Authorization', `Api-Key ${testUser.authToken}`);
        }).then(() => {
          return Invitation.findByGameId(testGameId);
        }).then((invites) => {
          let invite = invites.filter(invite => invite.userId === testUser.id)[0]
          expect(invite.accepted).toBe(1);
          done();
        });
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
