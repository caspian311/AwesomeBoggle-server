import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
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
      it('should return create a user', (done) => {
        let username = 'new_user';

        return request(app).post('/api/v1.0/users')
          .send({
            username: username
          })
          .then(response => {
            expect(response.statusCode).toBe(200);
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

  afterAll(() => {
    conn.end();
  });
});
