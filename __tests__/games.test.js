import request from 'supertest';
import app from '../src/app';

describe('games', () => {
  describe('GET /api/v1.0/games/:id', () => {
    describe('for games that don\'t exist', () => {
      it('should return a bad request', () => {
        return request(app)
          .get('/api/v1.0/games/99999')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .then(response => {
            expect(response.statusCode).toBe(404);
          });
      });

      describe('for games that don\'t exist', () => {
        it('should return game info', () => {
          return request(app)
            .get('/api/v1.0/games/1')
            .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
            .expect(200, {
              "id": 1,
              "finished": 1,
              "scores": [
                  {
                      "userId": 1,
                      "username": "matt",
                      "score": 12
                  },
                  {
                      "userId": 2,
                      "username": "abbi",
                      "score": 20
                  }
              ]
            });
        });
      });
    });
  });
});
