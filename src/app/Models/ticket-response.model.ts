import { Ticket } from "./ticket.model";

export class TicketResponse {
  content!: Ticket[];
  pageNumber!: number;
  pageSize!: number;
  totalElements!: number;
  totalPages!: number;
  lastPage!: boolean;
}
