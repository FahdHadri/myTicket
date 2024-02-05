import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../Models/order.model';
import { Observable, catchError, throwError } from 'rxjs';
import { OrderResponse } from '../Models/order-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private _http:HttpClient) {}

createOrder(orderRequest: Order): Observable<Order> {
  return this._http.post<Order>(`${this.apiUrl}/public/users/order/create`, orderRequest)
    .pipe(
      catchError(this.handleError)
    );
}

deleteOrder(orderId: number): Observable<string> {
  return this._http.delete<string>(`${this.apiUrl}/public/users/order/${orderId}`)
    .pipe(
      catchError((error) => {
        console.error('Error occurred during the delete request:', error);
        return throwError(error);
      })
    );
}

getAllOrders(): Observable<Order[]> {
  return this._http.get<Order[]>(`${this.apiUrl}/public/users/order/all`)
    .pipe(
      catchError(this.handleError)
    );
}

getOrdersByEmail(email: string): Observable<Order[]> {
  const url = `${this.apiUrl}/public/order/by-email/${email}`;
  return this._http.get<Order[]>(url);
}

updateOrderStatus(orderId: number, newStatus: string): Observable<Order> {

  const url = `${this.apiUrl}/admin/order/${orderId}/status?newStatus=${newStatus}`;

  return this._http.put<Order>(url, {})
    .pipe(
      catchError(this.handleError)
    );
}

getOrderByIdWithDetails(orderId: number): Observable<Order> {
  return this._http.get<Order>(`${this.apiUrl}/public/user/order/${orderId}`)
    .pipe(
      catchError(this.handleError)
    );
}

// Error handling function
private handleError(error: any) {
  console.error('An error occurred:', error);
  return throwError('Something went wrong. Please try again later.');
}

getTicketById(ticketId: number): Observable<any> {
  const url = `${this.apiUrl}/admin/ticket/${ticketId}`;

  return this._http.get<any>(url).pipe(
    catchError((error) => {
      console.error('Error fetching ticket:', error);
      return throwError(error);
    })
  );
}

getAllOrder(
  pageNumber: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string
): Observable<OrderResponse> {
  const params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString())
    .set('sortBy', sortBy)
    .set('sortOrder', sortOrder);

  return this._http.get<OrderResponse>(`${this.apiUrl}/public/orders`, { params });
}
}
