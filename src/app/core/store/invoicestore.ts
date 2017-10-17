import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IInvoice } from '../models/invoices/invoice.model';
import { InvoiceService } from '../invoiceservice.service';
import { IInvoiceLineItem } from '../models/invoices/invoicelineitem.model';

@Injectable()

export class InvoiceStore {

  private _latestInvoiceDetails: BehaviorSubject<IInvoice> = new BehaviorSubject(null);
  private _latestInvoiceId: BehaviorSubject<number> = new BehaviorSubject(null);
  private _ItemizedInvoiceDetails: BehaviorSubject<IInvoiceLineItem[]> = new BehaviorSubject(null);

  constructor(private InvoiceService: InvoiceService) {}

  get LatestInvoiceDetails() {
    return this._latestInvoiceDetails.asObservable();
  }

  LoadLatestInvoiceDetails(serviceAccountId: string) {
    this.InvoiceService.getLatestInvoice(serviceAccountId).subscribe(
      InvoiceDetails => {
        this._latestInvoiceDetails.next(InvoiceDetails);
      }
    );
  }
}
