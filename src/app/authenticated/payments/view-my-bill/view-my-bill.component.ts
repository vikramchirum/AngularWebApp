import { Component, OnDestroy, OnInit } from '@angular/core';
import { orderBy, sortBy, reverse } from 'lodash';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { PaymentsHistoryService } from '../../../core/payments-history.service';
import { PaymentsHistory } from '../../../core/models/payments/payments-history.model';
import { PaymentsHistoryStore } from '../../../core/store/paymentsstore';
import { InvoiceStore } from '../../../core/store/invoicestore';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit, OnDestroy {

  all_bills: IInvoice[];
  sort_all_bills: IInvoice[];
  public req1_bill: IInvoice;

  error: string = null;
  public req_bill: IInvoice;
  public latest_invoice_id: number;
  public service_account_id: string;
  public id: string;
  date_today = new Date;
  LatestBillAmount: number;
  LatestBillPaymentDate: Date;
  private payments: PaymentsHistory[] = null;
  private ActiveServiceAccountSubscription: Subscription = null;

  constructor(private invoice_service: InvoiceService,
              private InvoiceStore: InvoiceStore,
              private ServiceAccountService: ServiceAccountService,
              private PaymentsHistoryService: PaymentsHistoryService,
              private PaymentsHistoryStore: PaymentsHistoryStore
  ) {
  }

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        // this.latest_invoice_id = result.Latest_Invoice_Id;
        // Need to get latest invoice

        this.service_account_id = result.Id;
        this.InvoiceStore.LatestInvoiceDetails.subscribe(
          latestInvoice => {
            if (!latestInvoice ) {
              return;
            }
            console.log('Return from invoice call');
            this.latest_invoice_id = latestInvoice.Invoice_Id;
            console.log('After setting invoice id');
            this.req_bill = latestInvoice;
          });
        // this.PaymentsHistoryService.GetPaymentsHistoryCacheable(result).subscribe(
        this.PaymentsHistoryStore.PaymentHistory.subscribe(
          PaymentsHistoryItems => {
            if (PaymentsHistoryItems) {
              this.payments = PaymentsHistoryItems;
              this.LatestBillAmount = this.payments[0].PaymentAmount;
              this.LatestBillPaymentDate = this.payments[0].PaymentDate;
            }
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
