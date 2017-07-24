/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from './httpclient';
import { IBillLineItem } from './models/billlineitem.model';
import { IBill } from './models/bill.model';
import { BillingAccountService } from './BillingAccount.service';
import { forEach } from 'lodash';

@Injectable()
export class InvoiceService {

  private cachedInvoices: IBill[] = null;

  constructor(
    private HttpClient: HttpClient,
    private BillingAccountService: BillingAccountService
  ) {
    // Clear the cache if the active billing account changes.
    this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      () => this.cachedInvoices = null
    );
  }

  getBills(billingAccountId: number): Observable<IBill[]>   {

    return this.HttpClient.get(`/invoice/${billingAccountId}/bills`)
      .map(res => res.json())
      .map(bills => forEach(bills, bill => {
        bill.Invoice_Date = new Date(bill.Invoice_Date);
        bill.Due_Date = new Date(bill.Due_Date);
      }))
      .map(bills => this.cachedInvoices = bills)
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getBillsCacheable(billingAccountId: number): Observable<IBill[]> {

    if (this.cachedInvoices) {
      return Observable.of(this.cachedInvoices).delay(0);
    }

    return this.getBills(billingAccountId);

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
