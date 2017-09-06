/**
 * Created by vikram.chirumamilla on 9/6/2017.
 */
import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';

import {IReferral} from './models/referrals/referral.model';

@Injectable()
export class RenewalService {

  constructor(private http: HttpClient) {
  }

  getReferral(customerAccountId: string): Observable<IReferral> {
    const relativePath = `/referrals?customer_account_id=/${customerAccountId}`;
    return this.http.get(relativePath)
      .map((response: Response) => {
        return <IReferral> response.json();
      })
      .catch(error => this.http.handleHttpError(error));
  }
}
