/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from './httpclient';
import { IBillLineItem } from './models/billlineitem.model';
import { IBill } from './models/bill.model';
import { forEach } from 'lodash';

@Injectable()
export class InvoiceService {

  constructor(
    private HttpClient: HttpClient
  ) { }

  getBills(billingAccountId: number): Observable<IBill[]>   {

    return this.HttpClient.get(`/invoice/${billingAccountId}/bills`)
      .map(res => res.json())
      .map(bills => forEach(bills, bill => {
        bill.Invoice_Date = new Date(bill.Invoice_Date);
        bill.Due_Date = new Date(bill.Due_Date);
      }))
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getBill(invoiceId: string): Observable<IBill>   {

    return this.HttpClient.get(`/invoice/${invoiceId}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getItemizedBillDetails(invoiceId: number): Observable<IBillLineItem[]>   {

    return this.HttpClient.get(`/invoice/${invoiceId}/details`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

}
