import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';

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
    describe('for games that don\'t exist', () => {
      it('should return a bad request', () => {
        return request(app)
          .get('/api/v1.0/games/99999')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .expect(404);
      });

      describe('for games that do exist', () => {
        it('should return game info', () => {
          return request(app)
            .get('/api/v1.0/games/1')
            .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
            .expect(200, {
              "id": 1,
              "scores": [ {} ]
              // "finished": 1,
              // "scores": [
              //     {
              //         "userId": 1,
              //         "username": "matt",
              //         "score": 12
              //     },
              //     {
              //         "userId": 2,
              //         "username": "abbi",
              //         "score": 20
              //     }
              // ]
            });
        });
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
