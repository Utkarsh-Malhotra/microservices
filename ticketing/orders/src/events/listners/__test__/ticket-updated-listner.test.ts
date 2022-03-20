import { TicketUpdatedListner } from "../ticket-updated-listner";
import { TicketUpdatedEvent } from "@utktickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
    // Create an instance of the listner
    const listner = new TicketUpdatedListner(natsWrapper.client);
    
    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save();

    // Create the fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString()
    } 

    // create a fake message object, we will ignore all the methods for type Message
    // @ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }

    return {listner,data,msg,ticket}
};


it('finds,updates, and saves a ticket', async () => {
    const { msg,data,listner,ticket } = await setup();
    await listner.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})  

it('acks the message', async () => {
    const { msg,data,listner } = await setup();
    await listner.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if the event has a skipped version number', async () => {
    const { msg,data,listner,ticket } = await setup();
    data.version = 10;
    try {
        await listner.onMessage(data,msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();

})