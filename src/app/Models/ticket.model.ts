import { Event } from './event.model';

export class Ticket {
  id?: number;
  ticketCat!: TicketCategory;
  price!: number;
  quantity!: number;
  imgUrlTicket?: string;
  event!: Event;
}

export enum TicketCategory {
  CHAISE = 'CHAISE',
  GRADIN = 'GRADIN',
  BALCON = 'BALCON',
  VIP = 'VIP'
}
