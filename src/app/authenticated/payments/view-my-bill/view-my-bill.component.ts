import {Component, OnDestroy, OnInit} from '@angular/core';
import {orderBy, sortBy, reverse} from 'lodash';
import {InvoiceService} from 'app/core/invoiceservice.service';
import {IInvoice} from 'app/core/models/invoices/invoice.model';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {Subscription} from 'rxjs/Subscription';
import {PaymentsHistoryService} from '../../../core/payments-history.service';
import {PaymentsHistory} from '../../../core/models/payments/payments-history.model';

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
              private ServiceAccountService: ServiceAccountService,
              private PaymentsHistoryService: PaymentsHistoryService) {
  }

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        // this.latest_invoice_id = result.Latest_Invoice_Id;
        // Need to get latest invoice

        this.service_account_id = result.Id;
        this.invoice_service.getLatestInvoiceId(this.service_account_id).subscribe(
          res => {
            console.log('Return from invoice call');
            this.latest_invoice_id = res;
            console.log('After setting invoice id');
            this.invoice_service.getInvoice(this.latest_invoice_id, this.service_account_id)
              .subscribe(
                response => {console.log('Return from get invoice call'); this.req_bill = response; },
                error => this.error = error.Message
              );
          });
        this.PaymentsHistoryService.GetPaymentsHistoryCacheable(result).subscribe(
          PaymentsHistoryItems => {
            // No need to sort as the data we get is sorted from API
            // this.payments = reverse(sortBy(PaymentsHistoryItems, 'PaymentDate' ));
            this.payments = PaymentsHistoryItems;
            this.LatestBillAmount = this.payments[0].PaymentAmount;
            this.LatestBillPaymentDate = this.payments[0].PaymentDate;
            console.log('Payments', PaymentsHistoryItems.length, PaymentsHistoryItems);
            // console.log('Payments in view my bill component', PaymentsHistoryItems.length,  this.payments);
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
