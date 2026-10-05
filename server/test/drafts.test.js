import './setup.js';
import { afterEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const owner = '111111111111111111111111';
const other = '222222222222222222222222';
const id = '333333333333333333333333';
const token = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET);
const auth = (method, path, userId = owner) => request(app)[method](path).set('Authorization', `Bearer ${token(userId)}`);
afterEach(() => mock.restoreAll());
const mockUser = () => mock.method(User, 'findById', (userId) => ({ select: async () => ({ _id: userId }) }));

test('dashboard query is restricted to the authenticated author', async () => {
  mockUser();
  let query;
  mock.method(Post, 'find', (filter) => {
    query = filter;
    return { sort: async () => [{ _id: id, author: owner, isPublished: false }] };
  });
  const response = await auth('get', '/api/posts/mine');
  assert.equal(response.status, 200);
  assert.deepEqual(query, { author: owner });
  assert.equal(response.body[0].isPublished, false);
});

test('private draft reads constrain both post ID and authenticated author', async () => {
  mockUser();
  let query;
  mock.method(Post, 'findOne', async (filter) => { query = filter; return null; });
  const response = await auth('get', `/api/posts/mine/${id}`, other);
  assert.equal(response.status, 404);
  assert.deepEqual(query, { _id: id, author: other });
});

test('anonymous access to author endpoints never reaches the database', async () => {
  const find = mock.method(Post, 'find', () => { throw new Error('Must not query database'); });
  const findOne = mock.method(Post, 'findOne', () => { throw new Error('Must not query database'); });
  for (const path of ['/api/posts/mine', `/api/posts/mine/${id}`]) {
    assert.equal((await request(app).get(path)).status, 401);
  }
  assert.equal(find.mock.callCount(), 0);
  assert.equal(findOne.mock.callCount(), 0);
});

test('non-owner cannot publish, edit, or delete a draft', async () => {
  mockUser();
  let writes = 0;
  const draft = { author: owner, isPublished: false, save: async () => { writes++; }, deleteOne: async () => { writes++; } };
  mock.method(Post, 'findById', async () => draft);
  for (const updates of [{ isPublished: true }, { title: 'Stolen' }]) {
    assert.equal((await auth('put', `/api/posts/${id}`, other).send(updates)).status, 403);
  }
  assert.equal((await auth('delete', `/api/posts/${id}`, other)).status, 403);
  assert.equal(writes, 0);
  assert.equal(draft.isPublished, false);
});

test('new posts default to private while explicit publishing is supported', async () => {
  mockUser();
  mock.method(Post, 'create', async (data) => data);
  for (const [extra, expected] of [[{}, false], [{ isPublished: true }, true]]) {
    const response = await auth('post', '/api/posts').send({ title: 'Notes', content: 'Private notes', ...extra });
    assert.equal(response.status, 201);
    assert.equal(response.body.isPublished, expected);
    assert.equal(response.body.author, owner);
  }
});

test('publishing-only updates preserve content and tags, and cannot transfer ownership', async () => {
  mockUser();
  const draft = { author: owner, title: 'Notes', content: 'Text', tags: ['node'], isPublished: false };
  draft.save = async () => ({ ...draft, save: undefined });
  mock.method(Post, 'findById', async () => draft);
  const response = await auth('put', `/api/posts/${id}`).send({ isPublished: true, author: other });
  assert.equal(response.status, 200);
  assert.equal(response.body.isPublished, true);
  assert.equal(response.body.author, owner);
  assert.deepEqual(response.body.tags, ['node']);
  assert.equal(response.body.content, 'Text');
});

test('invalid publication states and empty updates are rejected before database access', async () => {
  mockUser();
  const lookup = mock.method(Post, 'findById', () => { throw new Error('Must not query database'); });
  for (const body of [{}, { isPublished: 'true' }]) {
    assert.equal((await auth('put', `/api/posts/${id}`).send(body)).status, 400);
  }
  assert.equal(lookup.mock.callCount(), 0);
});
