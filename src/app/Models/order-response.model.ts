import { Order } from "./order.model";

export class OrderResponse {
  content!: Order[];
  pageNumber!: number;
  pageSize!: number;
  totalElements!: number;
  totalPages!: number;
  lastPage!: boolean;
}
