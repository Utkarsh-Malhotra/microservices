import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import mongoUnit from 'mongo-unit';

//let mongod = new MongoMemoryServer();
let mongod: any;
export const dbConnect = async () => {
  // mongod = await MongoMemoryServer.create({
  //   binary: {
  //     version: '3.0.0',
  //   },
  // });
  // const uri = mongod.getUri();
  await mongoUnit.start();
  const uri = mongoUnit.getUrl();
  await mongoose.connect(uri);
};

export const dbDisconnect = async () => {
  //await mongod.stop();
  await mongoUnit.stop();
  await mongoose.connection.close();
};

export const dbClean = async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
};
