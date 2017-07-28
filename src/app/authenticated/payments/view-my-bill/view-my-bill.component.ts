import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { InvoiceService } from 'app/core/invoiceservice.service';
import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { IInvoiceLineItem } from 'app/core/models/invoices/invoicelineitem.model';
import { first, orderBy, filter } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { ViewBillComponent } from 'app/shared/components/view-bill/view-bill.component';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnDestroy, AfterViewInit {

  all_bills: IInvoice[];  sort_all_bills: IInvoice[];
  public req1_bill: IInvoice;

  error: string = null;
  public req_bill: IInvoice;
  public latest_invoice_id: string;
  public service_account_id: number;
  public id: string;
  date_today = new Date;
  @ViewChild(ViewBillComponent) private viewBill: ViewBillComponent;

  private ActiveServiceAccountSubscription: Subscription = null;

  constructor(
    private invoice_service: InvoiceService,
    private ServiceAccountService: ServiceAccountService
  ) { }

  ngAfterViewInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.latest_invoice_id = result.Latest_Invoice_Id;
        this.service_account_id = Number(result.Id);
        this.invoice_service.getBill(this.latest_invoice_id)
          .subscribe(
            response => {
              this.req_bill = response;
              this.viewBill.PopulateItemizedBill(this.req_bill);
            },
            error => {
              this.error = error.Message;
            }
          );
      }
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }

}
