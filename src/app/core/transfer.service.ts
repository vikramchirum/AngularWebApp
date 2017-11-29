
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from './httpclient';

@Injectable()
export class TransferService {

  constructor(private http: HttpClient) { }

  submitMove(transferRequest): Observable<string> {
    console.log('transferRequest......', JSON.stringify(transferRequest));
    return this.http.post(`/Transfer_Service`, JSON.stringify(transferRequest))
      .map(res => {
        res.json();
        console.log('res', res.json());
      })
      .catch(error => this.http.handleHttpError(error));
  }
}
