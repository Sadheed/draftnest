import './setup.js';
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import Post from '../models/Post.js';

let owner;
let other;
before(async () => {
  const uri = process.env.TEST_MONGO_URI;
  if (!uri || !/^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/.test(uri)) {
    throw new Error('Set TEST_MONGO_URI to a disposable local MongoDB instance, e.g. mongodb://127.0.0.1:27017. Atlas/remote databases are refused.');
  }
  await mongoose.connect(uri, { dbName: `draftnest_test_${process.pid}_${Date.now()}`, serverSelectionTimeoutMS: 10000 });
  for (const [username, email] of [['owner', 'owner@example.test'], ['other', 'other@example.test']]) {
    const response = await request(app).post('/api/auth/signup').send({ username, email, password: 'test-password-123' });
    assert.equal(response.status, 201);
    if (username === 'owner') owner = response.body;
    else other = response.body;
  }
}, { timeout: 180000 });

after(async () => {
  if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
beforeEach(async () => { await Post.deleteMany({}); });

const authorized = (method, path, user = owner) => request(app)[method](path).set('Authorization', `Bearer ${user.token}`);
const create = async (extra = {}, user = owner) => {
  const response = await authorized('post', '/api/posts', user).send({ title: 'Learning transactions', content: 'My private notes', tags: ['node'], ...extra });
  assert.equal(response.status, 201);
  return response.body;
};

test('new posts default to private and are hidden from public reads, even with an owner token', async () => {
  const draft = await create();
  assert.equal(draft.isPublished, false);
  const feed = await request(app).get('/api/posts');
  assert.equal(feed.status, 200);
  assert.deepEqual(feed.body, []);
  assert.equal((await request(app).get(`/api/posts/${draft._id}`)).status, 404);
  assert.equal((await authorized('get', `/api/posts/${draft._id}`)).status, 404);
  const mine = await authorized('get', '/api/posts/mine');
  assert.equal(mine.status, 200);
  assert.equal(mine.body[0]._id, draft._id);
  const detail = await authorized('get', `/api/posts/mine/${draft._id}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.content, draft.content);
});

test('private routes require authentication and never expose another author drafts', async () => {
  const draft = await create();
  assert.equal((await request(app).get('/api/posts/mine')).status, 401);
  assert.equal((await request(app).get(`/api/posts/mine/${draft._id}`)).status, 401);
  assert.equal((await authorized('get', `/api/posts/mine/${draft._id}`, other)).status, 404);
  assert.deepEqual((await authorized('get', '/api/posts/mine', other)).body, []);
});

test('another author cannot edit, publish, transfer ownership, or delete a draft', async () => {
  const draft = await create();
  for (const updates of [{ title: 'Stolen' }, { isPublished: true }, { author: other._id, title: 'Transferred' }]) {
    const response = await authorized('put', `/api/posts/${draft._id}`, other).send(updates);
    assert.equal(response.status, 403);
  }
  assert.equal((await authorized('delete', `/api/posts/${draft._id}`, other)).status, 403);
  const unchanged = await Post.findById(draft._id);
  assert.equal(unchanged.title, draft.title);
  assert.equal(unchanged.isPublished, false);
  assert.equal(unchanged.author.toString(), owner._id);
});

test('owner can edit, publish, return to draft, and delete without losing tags or content', async () => {
  const draft = await create();
  let response = await authorized('put', `/api/posts/${draft._id}`).send({ title: 'Updated notes', author: other._id });
  assert.equal(response.status, 200);
  assert.equal(response.body.author, owner._id);
  assert.equal(response.body.isPublished, false);
  response = await authorized('put', `/api/posts/${draft._id}`).send({ isPublished: true });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.tags, ['node']);
  assert.equal(response.body.content, draft.content);
  assert.equal((await request(app).get(`/api/posts/${draft._id}`)).status, 200);
  assert.equal((await request(app).get('/api/posts')).body.length, 1);
  assert.equal((await authorized('get', `/api/posts/mine/${draft._id}`, other)).status, 404);
  response = await authorized('put', `/api/posts/${draft._id}`).send({ isPublished: false });
  assert.equal(response.status, 200);
  assert.equal((await request(app).get(`/api/posts/${draft._id}`)).status, 404);
  assert.deepEqual((await request(app).get('/api/posts')).body, []);
  assert.equal((await authorized('delete', `/api/posts/${draft._id}`)).status, 200);
  assert.equal((await authorized('get', `/api/posts/mine/${draft._id}`)).status, 404);
});

test('publishing accepts booleans only and an empty update is rejected', async () => {
  const draft = await create();
  for (const body of [{ isPublished: 'false' }, {}]) {
    assert.equal((await authorized('put', `/api/posts/${draft._id}`).send(body)).status, 400);
  }
  assert.equal((await authorized('post', '/api/posts').send({ title: 'Test', content: 'Notes', isPublished: 'true' })).status, 400);
  assert.equal((await Post.findById(draft._id)).isPublished, false);
});

test('explicitly published posts remain public and appear alongside drafts only in the owner dashboard', async () => {
  const published = await create({ isPublished: true });
  await create();
  await create({}, other);
  const feed = await request(app).get('/api/posts');
  assert.deepEqual(feed.body.map((post) => post._id), [published._id]);
  const mine = await authorized('get', '/api/posts/mine');
  assert.equal(mine.body.length, 2);
  assert.ok(mine.body.every((post) => post.author === owner._id));
  const login = await request(app).post('/api/auth/login').send({ email: 'owner@example.test', password: 'test-password-123' });
  assert.equal(login.status, 200);
  assert.ok(login.body.token);
});
