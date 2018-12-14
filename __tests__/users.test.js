import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';
import Game from '../src/models/game';
import Invitation from '../src/models/invitation';
import conn from '../src/db';

describe('users', () => {
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

  describe('GET /users/:username', () => {
    describe('for available usernames', () => {
      it('should return a success', () => {
        return request(app).get('/api/v1.0/users/monkey').then(response => {
          expect(response.statusCode).toBe(200);
        });
      });
    });

    describe('for unavailable usernames', () => {
      it('should return an error', () => {
        return request(app).get(`/api/v1.0/users/${testUser.username}`).then(response => {
          expect(response.statusCode).toBe(409);
        });
      });
    });
  });

  describe('POST /users', () => {
    describe('with good data', () => {
      it('should succeed', () => {
        let username = 'new_user1';

        return request(app).post('/api/v1.0/users')
          .send({
            username: username
          })
          .expect(200)
      });

      it('should return created user', () => {
        let username = 'new_user2';

        return request(app).post('/api/v1.0/users')
          .send({
            username: username
          })
          .expect((res) => {
              expect(res.body.username).toEqual(username);
              expect(res.body.id).toBeGreaterThan(0);
              expect(res.body.authToken.length).toBeGreaterThan(5);
          })
      });

      it('should create a user', (done) => {
        let username = 'new_user3';

        return request(app).post('/api/v1.0/users')
          .send({
            username: username
          })
          .then(() => {
            User.findByUsername(username).then((user) => {
              expect(user.username).toEqual(username);
              done();
            });
          });
      });
    });

    describe('with unavailable username', () => {
      it('should fail', () => {
        return request(app).post('/api/v1.0/users')
          .send({
            username: testUser.username
          })
          .then(response => {
            expect(response.statusCode).toBe(409);
          });
      });
    });
  });

  describe('GET /users', () => {
    describe('without authentication', () => {
      it('should return a bad request error', () => {
        return request(app).get('/api/v1.0/users')
          .expect(401);
      });
    });

    describe('with authentication', () => {
      it('should return a success', () => {
        return request(app).get('/api/v1.0/users')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(200);
      });

      it('should return available users', async () => {
        let user2 = await User.create('test_user2');
        let user3 = await User.create('test_user3');
        let user4 = await User.create('test_user4');

        let previousGame = await Game.createGame();
        await Invitation.inviteOpponents(previousGame.gameId, [ testUser.id, user3.id ]);
        await Invitation.accept(previousGame.gameId, testUser.id);
        await Invitation.accept(previousGame.gameId, user3.id);
        await Game.completeGame(previousGame.gameId, testUser.id, 1);
        await Game.completeGame(previousGame.gameId, user3.id, 1);

        await Invitation.inviteOpponents(testGameId, [ testUser.id, user3.id, user4.id ]);
        await Invitation.accept(testGameId, testUser.id);
        await Invitation.accept(testGameId, user4.id);

        return request(app).get('/api/v1.0/users')
          .set('Authorization', `Api-Key ${testUser.authToken}`)
          .expect(
            [
              { id: user2.id, username: user2.username },
              { id: user3.id, username: user3.username }
            ]
          );
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
