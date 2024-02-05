import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Event } from '../Models/event.model';
import { EventResponse } from '../Models/event-response.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8082/api';

constructor(private _http:HttpClient) {}

saveEvent(eventDto: Event): Observable<Event> {
  return this._http.post<Event>(`${this.apiUrl}/admin/event/save`, eventDto);
}

getEvents(): Observable<Event[]> {
  return this._http.get<Event[]>(`${this.apiUrl}/public/event/all`);
}

searchEvents(keyword: string): Observable<Event[]> {
  return this._http.get<Event[]>(`${this.apiUrl}/public/event/search?keyword=${keyword}`);
}

getEvent(id: number): Observable<Event> {
  return this._http.get<Event>(`${this.apiUrl}/public/event/${id}`);
}

updateEvent(id: number, eventDto: Event): Observable<Event> {
  return this._http.put<Event>(`${this.apiUrl}/admin/event/${id}`, eventDto);
}

deleteEvent(id: number): Observable<void> {
  return this._http.delete<void>(`${this.apiUrl}/admin/event/${id}`);
}

getEventsByCategory(cat: string): Observable<any> {
  // Check if cat is a valid string
  if (typeof cat !== 'string') {
    console.error('Invalid category value:', cat);
    return throwError('Invalid category value');
  }

  const url = `${this.apiUrl}/public/event/category/${cat}`;

  return this._http.get(url).pipe(
    catchError((error: any) => {
      console.error(error);
      throw error;
    })
  );
}
getEventsBySessionId(sessionId: number): Observable<Event[]> {
  const url = `${this.apiUrl}/public/event/session/${sessionId}`;
  return this._http.get<Event[]>(url);
}
getAllEvents(
  pageNumber: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string
): Observable<EventResponse> {
  const params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString())
    .set('sortBy', sortBy)
    .set('sortOrder', sortOrder);

  return this._http.get<EventResponse>(`${this.apiUrl}/public/events`, { params });
}
getEventsWithPagination(
  pageNumber: number = 0,
    pageSize: number = 2,
    sortBy: string = 'eventId',
    sortOrder: string = 'asc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this._http.get(`${this.apiUrl}/public/events`, { params });
  }
}




