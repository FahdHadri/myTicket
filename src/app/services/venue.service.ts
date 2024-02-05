import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venue } from '../Models/venue.model';
import { Observable, catchError } from 'rxjs';
import { VenueResponse } from '../Models/venue-response.model';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private _http:HttpClient) {}

saveVenue(venue: Venue): Observable<Venue> {
  return this._http.post<Venue>(`${this.apiUrl}/admin/venue/save`, venue)
  .pipe(
    catchError((error: any) => {
      console.error('Error occurred:', error);
      throw error;
    })
  );
}
getVenues(): Observable<Venue[]> {
  return this._http.get<Venue[]>(`${this.apiUrl}/public/venue/all`);
}


deleteVenue(id: number): Observable<any> {
  return this._http.delete(`${this.apiUrl}/admin/venue/${id}`);
}

updateVenue(id: number, venueDto: Venue): Observable<Venue> {
    return this._http.put<Venue>(`${this.apiUrl}/admin/venue/${id}`, venueDto)
    .pipe(
      catchError((error: any) => {
        console.error('Error occurred:', error);
        throw error;
      })
    );
  }

  getVenue(id: number): Observable<Venue> {
    const url = `${this.apiUrl}/public/venue/${id}`;
    return this._http.get<Venue>(url);
  }

  getAllVenues(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortOrder: string
  ): Observable<VenueResponse> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this._http.get<VenueResponse>(`${this.apiUrl}/public/venues`, { params });
  }

}

