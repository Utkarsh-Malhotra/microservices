import { Listner,OrderCreatedEvent, OrderStatus, Subjects } from "@utktickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCreatedListner extends Listner<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // if not ticket then throw error
        if(!ticket) {
            throw new Error('Ticket not found')
        }

        // Mark the ticket as been reserved by setting its orderId property
        ticket.set({orderId: data.id})
        
        // Save the ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client) // no need t get client from other file as the client is protected now
        .publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })
        // ack the message
        msg.ack();
    }

}