import mongoose from "mongoose";
import { Order,OrderStatus } from './orders'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
// No need to create this in common library since 
// order collection needs to know about only few data 
interface TicketAttrs {
    id: string;
    title: string,
    price: number,
}

export interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}   

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        }
    }
});

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.methods.isReserved = async function() { // Write function keyword
    // this === the ticket document we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };