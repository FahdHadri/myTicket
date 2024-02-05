import { OrderItem } from "./order-item.model";

export class Order {
  orderId?: number;
  email!: string;
  dateOrdered?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  totalAmount?: number;
  orderStatus?: string;
  orderItems?: OrderItem[];
}
