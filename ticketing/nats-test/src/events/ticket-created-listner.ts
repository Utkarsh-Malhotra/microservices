import nats, {Message, Stan} from 'node-nats-streaming';
import { Listner } from './base-listner';
import { TicketCreatedEvent } from './ticket-created-events';
import { Subjects } from './subjects';
export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
    // subject: Subjects.TicketCreated = Subjects.TicketCreated;  // :Subjects.TicketCreated Ensures that subject does not update after this operation or you can go by second option below
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data',data);
        console.log(data.id);
        console.log(data.price);
        msg.ack();
    }

}