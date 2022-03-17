import {Message, Stan} from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;

}
export abstract class Listner<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    // to do operation after recieving message
    abstract onMessage(data: T['data'], msg: Message) : void ;
    private client: Stan;
    protected ackWait = 5 * 1000;
    
    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOption() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOption()
        )

        subscription.on('message', (msg:Message) => {
            console.log(`message recieved: ${this.subject}${this.queueGroupName}`)
            
            const parseData = this.parseMessage(msg);

            this.onMessage(parseData,msg);
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
                ? JSON.parse(data)
                : JSON.parse(data.toString('utf8')) //parse a buffer
    }

}

