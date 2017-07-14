import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { get } from 'lodash';

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
