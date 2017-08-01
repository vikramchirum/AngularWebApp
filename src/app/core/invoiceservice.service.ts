/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */

import {Injectable } from '@angular/core';

import {forEach} from 'lodash';
import {Observable} from 'rxjs/Rx';

import {HttpClient} from './httpclient';
import {IInvoice} from './models/invoices/invoice.model';
import {ServiceAccountService} from './serviceaccount.service';
import {IInvoiceSearchRequest} from './models/invoices/invoicesearchrequest.model';
import {IInvoiceLineItem} from 'app/core/models/invoices/invoicelineitem.model';

@Injectable()
export class InvoiceService {

  private cachedInvoices: IInvoice[] = null;
  constructor(private HttpClient: HttpClient, private ServiceAccountService: ServiceAccountService) {
    // Clear the cache if the active service account changes.
    this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      () => this.cachedInvoices = null
    );
  }

  getInvoices(invoiceSearchRequest: IInvoiceSearchRequest): Observable<IInvoice[]> {
    return this.HttpClient.search(`/invoice`, invoiceSearchRequest)
      .map(res => res.json())
      .map(bills => forEach(bills, bill => {
        bill.Invoice_Date = new Date(bill.Invoice_Date);
        bill.Due_Date = new Date(bill.Due_Date);
      }))
      .map(bills => this.cachedInvoices = bills)
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getInvoicesCacheable(invoiceSearchRequest: IInvoiceSearchRequest): Observable<IInvoice[]> {
    if (this.cachedInvoices) {
      return Observable.of(this.cachedInvoices).delay(0);
    }

    return this.getInvoices(invoiceSearchRequest);
  }

  getInvoice(invoiceId: string): Observable<IInvoice>   {
    return this.HttpClient.get(`/invoice/${invoiceId}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getItemizedInvoiceDetails(invoiceId: number): Observable<IInvoiceLineItem[]>   {
    return this.HttpClient.get(`/invoice/${invoiceId}/details`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }
}
