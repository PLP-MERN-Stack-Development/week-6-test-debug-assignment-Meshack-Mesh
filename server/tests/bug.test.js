import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Bug from '../models/Bug.js';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/bugtracker_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Bug API', () => {
  it('should create a bug', async () => {
    const res = await request(app).post('/api/bugs').send({ title: 'Test Bug' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Test Bug');
  });
});
