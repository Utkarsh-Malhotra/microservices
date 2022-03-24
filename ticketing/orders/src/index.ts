import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListner } from './events/listners/ticket-created-listner';
import { TicketUpdatedListner } from './events/listners/ticket-updated-listner';
import { ExpirationCompleteListner } from './events/listners/expiration-complete-listner';
import { PaymentCreatedListener } from './events/listners/payment-created-listner';

const start = async () => {
  console.log('starting orders service ............');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListner(natsWrapper.client).listen();
    new TicketUpdatedListner(natsWrapper.client).listen();
    new ExpirationCompleteListner(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Orders Service on 3000!!');
  });
};

start();
