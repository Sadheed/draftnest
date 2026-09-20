import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

test('GET /api/health returns service status', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(typeof response.body.timestamp, 'string');
});

test('unknown endpoints return a consistent 404 response', async () => {
  const response = await request(app).get('/api/does-not-exist');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /not found/i);
});

test('signup rejects invalid input before reaching the database', async () => {
  const response = await request(app)
    .post('/api/auth/signup')
    .send({ username: 'x', email: 'not-an-email', password: 'short' });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Validation failed');
  assert.ok(response.body.errors.length > 0);
});

test('post IDs are validated before querying MongoDB', async () => {
  const response = await request(app).get('/api/posts/not-an-object-id');

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Validation failed');
});

test('protected post creation requires a bearer token', async () => {
  const response = await request(app)
    .post('/api/posts')
    .send({ title: 'Test', content: 'Content', tags: [] });

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});