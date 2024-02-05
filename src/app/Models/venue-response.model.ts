import { Venue } from "./venue.model";

export class VenueResponse {

  content!: Venue[];
  pageNumber!: number;
  pageSize!: number;
  totalElements!: number;
  totalPages!: number;
  lastPage!: boolean;
}
