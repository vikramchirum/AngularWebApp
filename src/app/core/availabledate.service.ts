import { Injectable } from '@angular/core';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { ITduAvailabilityResult } from './models/availabledate/tduAvailabilityResult.model';

@Injectable()
export class AvailableDateService {
  constructor(private http: HttpClient) {
  }

  getAvailableDate(UAN: string): Observable<ITduAvailabilityResult> {
    const relativePath = `/availabledate/${UAN}`;
    return this.http.get(relativePath)
      // .map(data => { data.json(); return data.json(); })
      .map(data => { return <ITduAvailabilityResult> data.json(); })
      // .map(data => { forEach (var item in data.Available_Move_In_Dates) { item.substring(0,9) })
      .catch(error => this.http.handleHttpError(error));
  }
}
