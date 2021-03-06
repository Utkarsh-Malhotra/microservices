import { TicketCreatedListner } from "../ticket-created-listner";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@utktickets/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
    // Create an instance of the listner
    const listner = new TicketCreatedListner(natsWrapper.client);
    
    // Create the fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    } 

    // create a fake message object, we will ignore all the methods for type Message
    // @ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }

    return {listner,data,msg}
};

it('creates and saves a ticket', async () => {
    
    const {listner,data,msg} = await setup();
    // call the onMessage function with data object + message object
    await listner.onMessage(data, msg);
    
    // Write assertion to make sure the ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
    const {listner,data,msg} = await setup();
    // call the onMessage function with data object + message object
    await listner.onMessage(data,msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
})

