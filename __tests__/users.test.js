import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';
import Game from '../src/models/game';
import conn from '../src/db';

describe('users', () => {
  var testUser = null;

  beforeEach(async () => {
    await User.deleteAll();
    return User.create('test_user').then(user => {
      testUser = user;
    });
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

      // it('should return available users', () => {
      //   return request(app).get('/api/v1.0/users')
      //     .set('Authorization', `Api-Key ${testUser.authToken}`)
      //     .expect(
      //       [
      //         { id: 2, username: 'abbi' },
      //         { id: 6, username: 'new_user1' },
      //         { id: 7, username: 'new_user2' },
      //         { id: 8, username: 'new_user3' },
      //         { id: 5, username: 'peter' }
      //       ]
      //     );
      // });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
