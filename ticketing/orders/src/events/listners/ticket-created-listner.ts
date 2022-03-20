import nats, { Stan,Message } from 'node-nats-streaming';
import { Subjects,Listner, TicketCreatedEvent } from '@utktickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title,price,id } = data;
        const ticket = Ticket.build({
            title,price,id
        })

        await ticket.save();

        msg.ack();
    }
}
