import nats, {Message} from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listner connected to NATS')
    
    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true) // not acknowledge automatically
        .setDeliverAllAvailable()
        .setDurableName('accounting-service')

    const subscription = stan.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        options
        )
    
        subscription.on('message', (msg: Message) => {
            const data = msg.getData();

            if (typeof data === 'string') {
                console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`)
            }

            msg.ack();
        })
})

// Interrupt or terminate request
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
