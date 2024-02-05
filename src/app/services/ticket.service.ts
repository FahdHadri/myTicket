import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, takeUntil, throwError } from 'rxjs';
import { Ticket } from '../Models/ticket.model';
import { TicketResponse } from '../Models/ticket-response.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:8082/api';
  private unsubscribe$ = new Subject<void>();

  constructor(private _http:HttpClient) {}

  saveTicket(ticketsDto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post<any>(`${this.apiUrl}/admin/ticket/save`, ticketsDto, { headers })
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  getAllTickets(): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/public/ticket/all`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  searchTicketsByEventIdAndCategory(eventId: number, category: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/api/public/ticket/search1?eventId=${eventId}&category=${category}`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  searchTicketsByEvent(category: string, eventId: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/api/public/ticket/search2?category=${category}&eventId=${eventId}`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  updateTicket(id: number, ticketsDto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.put<any>(`${this.apiUrl}/admin/ticket/${id}`, ticketsDto, { headers }).pipe(
      map((response) => response),
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  deleteTicket(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/admin/ticket/${id}`).pipe(
        catchError((error) => {
            console.error('Error:', error);
            throw error;
        }),
        takeUntil(this.unsubscribe$)
    );
}

  getTicketsByEventId(eventId: number): Observable<Ticket[]> {
    const url = `${this.apiUrl}/admin/ticket/event/${eventId}`;

    return this._http.get<Ticket[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching tickets:', error);
        return throwError(error);
      })
    );
  }

  getTicketById(ticketId: number): Observable<Ticket> {
    const url = `${this.apiUrl}/admin/ticket/${ticketId}`;
    return this._http.get<Ticket>(url)
    .pipe(
      catchError((error) => {
        console.error('Error fetching ticket:', error);
        return throwError(error);
      })
    );
  }

  getAllTicket(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string
  ): Observable<TicketResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this._http.get<TicketResponse>(`${this.apiUrl}/public/tickets`, { params });
  }
}
