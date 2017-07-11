/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { filter, forEach } from 'lodash';
import { HttpClient } from './httpclient';
import { IBillLineItem } from './models/billlineitem.model';
import { IBill } from './models/bill.model';

@Injectable()
export class InvoiceService {

  constructor(private http: HttpClient) {
  }

  getBills(billingAccountId: number): Observable<IBill[]>   {

    const relativePath = `/invoice/${billingAccountId}/bills`;
    return this.http.get(relativePath)
      .map(res => res.json())
      .map((bills: IBill[]) => forEach(bills, bill => {

       console.log('rambesh');


        bill.Invoice_Date = new Date(bill.Invoice_Date);
        bill.Due_Date = new Date(bill.Due_Date);
      }))
      .catch(error => this.http.handleHttpError(error));
  }

  getBill(invoiceId: string): Observable<IBill>   {

    const relativePath = `/invoice/${invoiceId}`;
    return this.http.get(relativePath)
      .map(res => res.json())
     .catch(error => this.http.handleHttpError(error));
  }

  getItemizedBillDetails(invoiceId: number): Observable<IBillLineItem[]>   {

    const relativePath = `/invoice/${invoiceId}/details`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <IBillLineItem[]> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

}
