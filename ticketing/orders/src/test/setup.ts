import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

let mongod: any;

declare global {
  var signin: () => string[];
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.JWT_KEY = 'asdfj';
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks(); // clear all mocks
  const collections = await mongoose.connection.db.collections();

  for (let c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongod.stop();
});

global.signin =  () => {
  // Build a JWT payload. { id,email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test.test.com"
  }
  
  // Create the JWT!
  const token = jwt.sign(payload,process.env.JWT_KEY!);
  
  // Build session object , { jwt: JWT }
  const session = { jwt: token }
  
  // Turn that session into json
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string thats the cookie with encoded data 
  return [`express:sess=${base64}`];
};
