import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';

describe('inventations', () => {
  var testGameId = 0;

  beforeEach(() => {
    return Game.createGame().then((game) => {
      testGameId = game.gameId;
    });
  });

  describe('POST /games/:gameId/invitations', () => {
    describe('unauthorized requests', () => {
      it('should return a success', () => {
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
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
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
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .send({
            userIds: [ '2' ]
          })
          .expect(200);
      });

      it('should create an invitation', async () => {
        let originalInvitations = await Invitation.getAll();
        return request(app).post(`/api/v1.0/games/${testGameId}/invitations`)
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
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
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .send({
            userIds: [ '2', '5' ]
          })
          .expect([
            { gameId: testGameId, userId: 2, username: 'abbi' },
            { gameId: testGameId, userId: 5, username: 'peter' }
          ]);
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
