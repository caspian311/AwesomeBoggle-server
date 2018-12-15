import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';

describe('games', () => {
  describe('GET /api/v1.0/words', () => {
    it('should return a success', () => {
      return request(app)
        .get('/api/v1.0/words')
        .expect(200);
    });

    it('should return a list of words', () => {
      return request(app)
        .get('/api/v1.0/words')
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(1000);
        });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
