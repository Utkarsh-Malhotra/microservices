import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
let mongod: any;

declare global {
  var signin: () => Promise<string[]>;
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.JWT_KEY = 'asdfj';
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongod.stop();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
