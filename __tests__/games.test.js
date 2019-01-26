import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';
import User from '../src/models/user';

describe('games', () => {
  var testGameId = 0;
  var testUser = null;
  var otherTestUser = null;

  beforeEach(async () => {
    await User.deleteAll();
    await Game.deleteAll();
    testUser = await User.create('test_user_1');
    let testUser2 = await User.create('test_user_2');
    otherTestUser = await User.create('test_user_3');
    let game1 = await Game.create();
    let game2 = await Game.create();
    let game3 = await Game.create();
    let game4 = await Game.create();
    let game5 = await Game.create();

    await Game.complete(game1.gameId, testUser.id, 10);
    await Game.complete(game1.gameId, testUser2.id, 12);

    await Game.complete(game2.gameId, testUser.id, 12);
    await Game.complete(game2.gameId, testUser2.id, 14);

    await Game.complete(game3.gameId, testUser.id, 22);
    await Game.complete(game3.gameId, testUser2.id, 9);

    await Game.complete(game4.gameId, testUser2.id, 2);
    await Game.complete(game4.gameId, otherTestUser.id, 7);

    testGameId = game5.gameId;
  });

  describe('GET /api/v1.0/games', () => {
    describe('for unauthenticated users', () => {
      it('should return a bad request', () => {
        return request(app)
          .get('/api/v1.0/games')
          .expect(401);
      });
    });

    describe('for authenticated users', () => {
      it('should return a success', () => {
        return request(app)
          .get('/api/v1.0/games')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(200);
      });

      it('should show all games for that user', () => {
        return request(app)
          .get('/api/v1.0/games')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(res => {
            expect(res.body.length).toEqual(3);

            expect(res.body[0].win).toEqual(0);
            expect(res.body[1].win).toEqual(0);
            expect(res.body[2].win).toEqual(1);

            expect(res.body[0].scores.length).toEqual(2);
            expect(res.body[0].scores[0].userId).toEqual(testUser.id);
            expect(res.body[0].scores[0].username).toEqual(testUser.username);
          });
      });

      it('should show all games for another user', () => {
        return request(app)
          .get('/api/v1.0/games')
          .set('Authorization', `Api-Key ${otherTestUser.authToken}`)
          .expect(res => {
            expect(res.body.length).toEqual(1);
            expect(res.body[0].scores.length).toEqual(2);
            expect(res.body[0].scores[1].userId).toEqual(otherTestUser.id);
            expect(res.body[0].scores[1].username).toEqual(otherTestUser.username);
          });
      });
    });
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
