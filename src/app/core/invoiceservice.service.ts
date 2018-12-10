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
      .map(invoices => forEach(invoices, invoice => {
        invoice.Invoice_Date = new Date(invoice.Invoice_Date).setDate(new Date(invoice.Invoice_Date).getDate()+1); // Add day to match GEMS
        invoice.Due_Date = new Date(invoice.Due_Date).setDate(new Date(invoice.Due_Date).getDate()+1); // Add day to match GEMS
      }))
      .map(invoices => this.cachedInvoices = invoices)
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getInvoicesCacheable(invoiceSearchRequest: IInvoiceSearchRequest): Observable<IInvoice[]> {
    if (this.cachedInvoices) {
      return Observable.of(this.cachedInvoices).delay(0);
    }

    return this.getInvoices(invoiceSearchRequest);
  }

  getInvoice(invoiceId: number, serviceAccountId: string): Observable<IInvoice>   {
    return this.HttpClient.get(`/invoice/${serviceAccountId}/${invoiceId}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getItemizedInvoiceDetails(invoiceId: number, serviceAccountId: string): Observable<IInvoiceLineItem[]>   {
    const req = {} as IInvoiceSearchRequest;
    req.Invoice_Id = invoiceId;
    req.Service_Account_Id = serviceAccountId;
    return this.HttpClient.get(`/invoice/${serviceAccountId}/${invoiceId}/details`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getLatestInvoiceId(serviceAccountId: string): Observable<number> {
    return this.HttpClient.get(`/service_accounts/${serviceAccountId}/latest_invoice_id`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getLatestInvoice(serviceAccountId: string): Observable<IInvoice> {
    return this.HttpClient.get(`/service_accounts/${serviceAccountId}/latest_invoice`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  getInvoicePDF(invoiceId: number | string): Observable<any> {
    return this.HttpClient.downloadFile(`/documents/invoice/generate/${invoiceId}`)
      .catch(err => this.HttpClient.handleHttpError(err));
  }
}
