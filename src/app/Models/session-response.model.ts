import { Session } from "./session.model";

export class SessionResponse {

    content!: Session[];
    pageNumber!: number;
    pageSize!: number;
    totalElements!: number;
    totalPages!: number;
    lastPage!: boolean;
  }

