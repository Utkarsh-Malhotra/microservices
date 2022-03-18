import { Publisher,Subjects,TicketCreatedEvent } from '@utktickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject:Subjects.TicketCreated = Subjects.TicketCreated;

}