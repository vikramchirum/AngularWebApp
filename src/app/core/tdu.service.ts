import {forEach} from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { ITDU } from './models/tdu/tdu.model';
@Injectable()
export class  TDUService {
  constructor(private http: HttpClient) {
  }

  // getTDUS(): Observable<string[]> {
  //   return this.http.get(`/TDUs`)
  //     .map(data => {data.json();
  //       console.log('TDUs', data.json());
  //       return data.json();
  //     })
  //     .map(tdu => { return tdu.Duns_Number; })
  //     .catch(error => this.http.handleHttpError(error));
  // }
  getTDUS(): Observable<ITDU[]> {
      return this.http.get(`/TDUs`)
        .map(data => {data.json();
          console.log('TDUs', data.json());
          return data.json();
        })
        .map(data => <ITDU[]>data)
        .catch(error => this.http.handleHttpError(error));
  }
}
