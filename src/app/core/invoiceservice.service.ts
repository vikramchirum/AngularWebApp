/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */
import {Injectable } from '@angular/core';

import {forEach} from 'lodash';
import {Observable} from 'rxjs/Rx';

import {HttpClient} from './httpclient';
import {IInvoiceLineItem} from './models/invoices/invoicelineitem.model';
import {IInvoice} from './models/invoices/invoice.model';
import {ServiceAccountService} from './serviceaccount.service';

@Injectable()
export class InvoiceService {

  private cachedInvoices: IInvoice[] = null;

  constructor(
    private HttpClient: HttpClient,
    private ServiceAccountService: ServiceAccountService
  ) {
    // Clear the cache if the active service account changes.
    this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      () => this.cachedInvoices = null
    );
  }

  getBills(serviceAccountId: number): Observable<IInvoice[]>   {

    return this.HttpClient.get(`/invoice/${serviceAccountId}/bills`)
      .map(res => res.json())
      .map(bills => forEach(bills, bill => {
        bill.Invoice_Date = new Date(bill.Invoice_Date);
        bill.Due_Date = new Date(bill.Due_Date);
      }))
      .map(bills => this.cachedInvoices = bills)
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getBillsCacheable(serviceAccountId: number): Observable<IInvoice[]> {

    if (this.cachedInvoices) {
      return Observable.of(this.cachedInvoices).delay(0);
    }

    return this.getBills(serviceAccountId);

  }

  getBill(invoiceId: string): Observable<IInvoice>   {

    return this.HttpClient.get(`/invoice/${invoiceId}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getItemizedBillDetails(invoiceId: number): Observable<IInvoiceLineItem[]>   {

    return this.HttpClient.get(`/invoice/${invoiceId}/details`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

}
