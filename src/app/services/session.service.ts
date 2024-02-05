import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session } from '../Models/session.model';
import { Observable, catchError } from 'rxjs';
import { SessionResponse } from '../Models/session-response.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private _http:HttpClient) {}

  saveSession(session: Session): Observable<Session> {
    return this._http.post<Session>(`${this.apiUrl}/admin/session/save`, session)
    .pipe(
      catchError((error: any) => {
        console.error('Error occurred:', error);
        throw error;
      })
    );
    }


  getSessions(): Observable<Session[]> {
    return this._http.get<Session[]>(`${this.apiUrl}/public/session/all`);
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this._http.put<Session>(`${this.apiUrl}/admin/session/${id}`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/admin/session/${id}`);
  }

  getSession(id: number): Observable<Session> {
    const url = `${this.apiUrl}/public/session/${id}`;
    return this._http.get<Session>(url);
  }

  getAllSessions(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string
  ): Observable<SessionResponse> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this._http.get<SessionResponse>(`${this.apiUrl}/public/sessions`, { params });
  }


}

