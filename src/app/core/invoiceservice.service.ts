/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClient } from './httpclient';
import { IBillLineItem } from './models/billlineitem.model';
import { IBill } from './models/bill.model';

@Injectable()
export class InvoiceService {

  constructor(private http: HttpClient) {
  }

  getBills(billingAccountId: number): Observable<IBill[]>   {

    const relativePath = `/invoice/${billingAccountId}/bills`;
    return this.http.get(relativePath).map((response: Response) => {
      return <IBill[]> response.json();
    }).catch(this.handleError);
  }

  getItemizedBillDetails(invoiceId: number): Observable<IBillLineItem[]>   {

    const relativePath = `/invoice/${invoiceId}/details`;
    return this.http.get(relativePath).map((response: Response) => {
               return <IBillLineItem[]> response.json();
    }).catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
