import request from 'supertest';
import app from '../src/app';
import conn from '../src/db';
import Invitation from '../src/models/invitation';

describe('inventations', () => {
  describe('POST /invitations', () => {
    describe('unauthorized requests', () => {
      it('should return a success', () => {
        return request(app).post('/api/v1.0/invitations')
          .send({
            gameId: '2'
          })
          .then(response => {
            expect(response.statusCode).toBe(401);
          });
      });
    });

    describe('for invalid games', () => {
      it('should return a success', () => {
        return request(app).post('/api/v1.0/invitations')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .send({
            gameId: '123456',
            userId: '9999'
          })
          .then(response => {
            expect(response.statusCode).toBe(404);
          });
      });
    });

    describe('for valid games', () => {
      it('should return an error', () => {
        return request(app).post('/api/v1.0/invitations')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .send({
            gameId: '1',
            userId: '2'
          })
          .expect(200);
      });

      it('should create an invitation', async () => {
        let originalInvitations = await Invitation.getAll();
        return request(app).post('/api/v1.0/invitations')
          .set('Authorization', 'Api-Key 1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5')
          .send({
            gameId: '2',
            userId: '2'
          })
          .then(async () => {
            let currentInvitations = await Invitation.getAll();
            expect(currentInvitations.length).toBeGreaterThan(originalInvitations.length);
          });
      });
    });
  });

  afterAll(() => {
    conn.end();
  });
});
