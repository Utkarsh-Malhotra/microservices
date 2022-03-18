import { Publisher,Subjects,TicketUpdatedEvent } from '@utktickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject:Subjects.TicketUpdated = Subjects.TicketUpdated;

}