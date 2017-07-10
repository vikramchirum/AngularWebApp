import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { HttpClient } from './httpclient';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from 'environments/environment';
import { } from './models/transfer-service.model';
@Injectable()
export class TransferService {

  constructor(private http: HttpClient) { }

  submitMove(transferRequest): Observable<string> {
    console.log('transferRequest......', JSON.stringify(transferRequest));
    return this.http.post(`/Transfer_Service/Transfer_Service_Create`, JSON.stringify(transferRequest))
    .map(res => {
      res.json();
      console.log('res', res.json());
    })
    .catch(error => this.handleError(error));

  }
    private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    console.log('error', error);
    if (error instanceof Response) {
      const body = error.json() || '';
     // const err = get(body, 'error', JSON.stringify(body));
     // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


}
