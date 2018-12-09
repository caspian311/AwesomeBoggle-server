import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';

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

  afterAll(() => {
    conn.end();
  });
});
