export class EventResponse {
  content!: Event[];
  pageNumber!: number;
  pageSize!: number;
  totalElements!: number;
  totalPages!: number;
  lastPage!: boolean;
}
