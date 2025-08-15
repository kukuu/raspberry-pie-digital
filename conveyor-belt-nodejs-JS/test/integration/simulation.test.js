const request = require('supertest');
const app = require('../../index');

describe('Full Simulation', () => {
  test('should complete 100 steps', async () => {
    const response = await request(app)
      .post('/api/simulate')
      .send({ steps: 100 });
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(100);
  });
});