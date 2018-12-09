import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';

describe('users', () => {
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
        return request(app).get('/api/v1.0/users/matt').then(response => {
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
              expect(res.body.id).toBeGreaterThan(3);
              expect(res.body.auth_token.length).toBeGreaterThan(5);
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
        let username = 'matt';

        return request(app).post('/api/v1.0/users')
          .send({
            username: username
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
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(200);
      });

      it('should return available users', () => {
        return request(app).get('/api/v1.0/users')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(
            [
              { id: 2, username: 'abbi' },
              { id: 6, username: 'new_user1' },
              { id: 7, username: 'new_user2' },
              { id: 8, username: 'new_user3' },
              { id: 5, username: 'peter' }
            ]
          );
      });
    });
  });
});
