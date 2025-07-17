
const request = require('supertest');
const express = require('express');
const authRoutes = require('../server/routes/auth');
const db = require('../server/db/database');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  beforeAll((done) => {
    db.run('DELETE FROM users', done);
  });

  test('POST /signup creates a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
  });

  test('POST /login returns a token', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test2@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test2@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});