import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';
import User from '../src/models/user';

describe('games', () => {
  var testGameId = 0;
  var testUser = null;

  beforeEach(async () => {
    await User.deleteAll();
    await Game.deleteAll();
    testUser = await User.create('test_user');
    return Game.create().then((game) => {
      testGameId = game.gameId;
    })
  });

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
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(200);
      });

      it('should return the created game', () => {
        return request(app)
          .post('/api/v1.0/games')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(res => {
            expect(res.body.gameId).toBeGreaterThan(0);
            expect(res.body.grid.length).toEqual(16);
            expect(res.body.isReady).toBeFalsy();
          });
      });
    });
  });

  describe('GET /api/v1.0/games/:id', () => {
    describe('for unauthenticated users', () => {
      it('should return a bad request', () => {
        return request(app)
          .get(`/api/v1.0/games/${testGameId}`)
          .expect(401);
      });
    });

    describe('for games that don\'t exist', () => {
      it('should return a bad request', () => {
        return request(app)
          .get('/api/v1.0/games/99999')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(404);
      });
    });

    describe('for games that do exist', () => {
      it('should return a success', () => {
        return request(app)
          .get(`/api/v1.0/games/${testGameId}`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(200);
      });

      it('should return game info', async () => {
        let testUser2 = await User.create('other_user')
        await Invitation.inviteOpponents(testGameId, [testUser.id, testUser2.id]);
        return request(app)
          .get(`/api/v1.0/games/${testGameId}`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(res => {
            expect(res.body.id).toBe(testGameId);
            expect(res.body.grid.length).toEqual(16);
          });
      });

      describe('intially', () => {
        it('should return a NOT ready game', () => {
          return request(app)
            .get(`/api/v1.0/games/${testGameId}`)
            .set('Authorization', `Api-Key ${testUser.authToken}`)
            .expect(res => {
              expect(res.body.isReady).toEqual(false);
          });
        });
      });

      describe('for games with outstanding invitations', () => {
        it('should return a NOT ready game', async () => {
          let testUser2 = await User.create('other_user')
          await Invitation.inviteOpponents(testGameId, [testUser.id, testUser2.id]);
          return request(app)
            .get(`/api/v1.0/games/${testGameId}`)
            .set('Authorization', `Api-Key ${testUser.authToken}`)
            .expect(res => {
              expect(res.body.isReady).toEqual(false);
            });
        });
      });

      describe('for games that have accepted invitations', () => {
        it('should return a ready game', async () => {
          let testUser2 = await User.create('other_user')
          await Invitation.inviteOpponents(testGameId, [testUser.id, testUser2.id]);
          await Invitation.accept(testGameId, testUser.id);
          await Invitation.accept(testGameId, testUser2.id);
          return request(app)
            .get(`/api/v1.0/games/${testGameId}`)
            .set('Authorization', `Api-Key ${testUser.authToken}`)
            .expect(res => {
              expect(res.body.isReady).toEqual(true);
            });
        });
      });
    });
  });

  describe('PUT /api/v1.0/games/:id', () => {
    describe('for unauthenticated users', () => {
      it('should return a bad request', () => {
        return request(app)
          .put(`/api/v1.0/games/${testGameId}`, {})
          .expect(401);
      });
    });

    describe('for games that don\'t exist', () => {
      it('should return a bad request', () => {
        return request(app)
          .put('/api/v1.0/games/99999', {})
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(404);
      });
    });

    describe('for games that do exist', () => {
      it('should return a success', () => {
        return request(app)
          .put(`/api/v1.0/games/${testGameId}`)
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .send({"score": 1})
          .expect(200);
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
