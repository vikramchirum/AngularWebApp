import { Injectable } from '@angular/core';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { IAvailableDate } from './models/availabledate/availabledate.model';

@Injectable()
export class AvailableDateService {
  constructor(private http: HttpClient) {
  }

  getAvailableDate(UAN: string): Observable<IAvailableDate> {
    const relativePath = `/availabledate/${UAN}`;
    return this.http.get(relativePath)
      // .map(data => { data.json(); return data.json(); })
      .map(data => { return <IAvailableDate> data.json(); })
      // .map(data => { forEach (var item in data.Available_Move_In_Dates) { item.substring(0,9) })
      .catch(error => this.http.handleHttpError(error));
  }
}
