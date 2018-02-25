// Integration test to ensure app is up and running.

const request = require('supertest');
import app from '../express/app';

describe('Graphql status', () => {
  test('It should respond with a success message', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({ query: 'query  { status {message} }' });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.status.message).toBe('GraphQL OK');
  });
});

describe('express status', () => {
  test('It should respond with success message', async () => {
    const response = await request(app).get('/status');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Express status: OK');
  });
});
