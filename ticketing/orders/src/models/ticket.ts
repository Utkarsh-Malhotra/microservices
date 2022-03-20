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
    version: number,
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
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

// we are doing this because we can customise our version no to check for any difference and not only 1
// change 1 to 100 if differece is 100
// now we dont need the updateIfCurrentPlugin plugin
// ticketSchema.pre('save', function (done) {  // middleware that will run before saving a record
//     // find the document with version 1 less
//     this.$where = {
//         version: this.get('version') - 1
//     };
//     done();
// })

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    
    return Ticket.findOne({
        _id: event.id,
        version: event.version -1 
    })
}
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