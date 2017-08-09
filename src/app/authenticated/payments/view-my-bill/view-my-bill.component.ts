import { Component, OnDestroy, OnInit } from '@angular/core';

import { InvoiceService } from 'app/core/invoiceservice.service';
import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit, OnDestroy {

  all_bills: IInvoice[];  sort_all_bills: IInvoice[];
  public req1_bill: IInvoice;

  error: string = null;
  public req_bill: IInvoice;
  public latest_invoice_id: string;
  public service_account_id: number;
  public id: string;
  date_today = new Date;

  private ActiveServiceAccountSubscription: Subscription = null;

  constructor(
    private invoice_service: InvoiceService,
    private ServiceAccountService: ServiceAccountService
  ) { }

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        console.log('result......', result);
        this.latest_invoice_id = result.Latest_Invoice_Id;
        this.service_account_id = Number(result.Id);
        this.invoice_service.getInvoice(this.latest_invoice_id)
          .subscribe(
            response => this.req_bill = response,
            error => this.error = error.Message
          );
      }
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
