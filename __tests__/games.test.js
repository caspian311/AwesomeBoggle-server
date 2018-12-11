import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';

describe('games', () => {
  describe('POST /api/v1.0/games', () => {
    describe('for unauthenticated users', () => {
      it('should return a bad request', () => {
        return request(app)
          .post('/api/v1.0/games')
          .expect(401);
      });
    });

    describe('for authenticated users', () => {
      it('should return a success', () => {
        return request(app)
          .post('/api/v1.0/games')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(200);
      });

      it('should return a success', () => {
        return request(app)
          .post('/api/v1.0/games')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(res => {
            expect(res.body.gameId).toBeGreaterThan(2);
            expect(res.body.grid.length).toEqual(16);
            expect(res.body.isReady).toBeFalsy();
          });
      });
    });
  });

  describe('GET /api/v1.0/games/:id', () => {
    var testGameId = 0;

    beforeEach(() => {
      return Game.createGame().then((game) => {
        testGameId = game.gameId;
      });
    });

    describe('for games that don\'t exist', () => {
      it('should return a bad request', () => {
        return request(app)
          .get('/api/v1.0/games/99999')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(404);
      });
    });

    describe('for games that do exist', () => {
      it('should return a success', () => {
        return request(app)
          .get(`/api/v1.0/games/${testGameId}`)
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(200);
      });

      it('should return game info', () => {
        return Invitation.inviteOpponents(testGameId, [1, 2]).then(() => {
          return request(app)
            .get(`/api/v1.0/games/${testGameId}`)
            .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
            .expect(res => {
              expect(res.body.id).toBe(testGameId);
              expect(res.body.grid.length).toEqual(16);
            });
        });
      });

      describe('intially', () => {
        it('should return a NOT ready game', () => {
          return request(app)
            .get(`/api/v1.0/games/${testGameId}`)
            .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
            .expect(res => {
              expect(res.body.isReady).toEqual(false);
          });
        });
      });

      describe('for games with outstanding invitations', () => {
        it('should return a NOT ready game', () => {
          return Invitation.inviteOpponents(testGameId, [1, 2]).then(() => {
            return request(app)
              .get(`/api/v1.0/games/${testGameId}`)
              .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
              .expect(res => {
                expect(res.body.isReady).toEqual(false);
              });
          });
        });
      });

      describe('for games that have accepted invitations', () => {
        it('should return a ready game', () => {
          return Invitation.inviteOpponents(testGameId, [1, 2])
            .then(() => {
              return Invitation.accept(testGameId, 1);
            })
            .then(() => {
              return Invitation.accept(testGameId, 2);
            })
            .then(() => {
              return request(app)
                .get(`/api/v1.0/games/${testGameId}`)
                .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
                .expect(res => {
                  expect(res.body.isReady).toEqual(true);
                });
            });
        });
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
