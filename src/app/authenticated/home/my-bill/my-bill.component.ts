/**
 * Created by vikram.chirumamilla on 7/31/2017.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { InvoiceStore } from '../../../core/store/invoicestore';
import { PaymentsHistoryStore } from '../../../core/store/paymentsstore';
import { PaymentsHistory } from '../../../core/models/payments/payments-history.model';

@Component({
  selector: 'mygexa-my-bill',
  templateUrl: './my-bill.component.html',
  styleUrls: ['./my-bill.component.scss']
})
export class MyBillComponent implements OnInit, OnDestroy {

   dollarAmountFormatter: string;
   totalDue: number;
   noCurrentDue: boolean = null;
   exceededDueDate: boolean = null;
   activeServiceAccount: ServiceAccount;
   latestInvoice: IInvoice;
   autoPay: boolean;
  public Payments: PaymentsHistory[] = null;
  LatestBillAmount: number;
  LatestBillPaymentDate: Date;

  private activeServiceAccountSubscription: Subscription = null;
  private latestInvoiceDetailsSubscription: Subscription = null;
  private paymentHistorySubscription: Subscription = null;

  constructor(private ServiceAccountService: ServiceAccountService,
              private InvoiceStore: InvoiceStore,
              private PaymentHistoryStore: PaymentsHistoryStore
  ) {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.activeServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        if ( activeServiceAccount) {
          this.totalDue = activeServiceAccount.Current_Due + activeServiceAccount.Past_Due;
          this.autoPay = activeServiceAccount.Is_Auto_Bill_Pay;
        }
        this.noCurrentDue = this.activeServiceAccount.Current_Due > 0 ? true : false;
        console.log('Current due date', this.noCurrentDue);
        this.exceededDueDate = this.activeServiceAccount.Past_Due > 0 ? true : false;
        console.log('Exceeded due date', this.exceededDueDate);
        this.exceededDueDate =  (new Date(this.activeServiceAccount.Due_Date) > new Date()) ? true : false;
        if (!this.autoPay) {
          this.paymentHistorySubscription = this.PaymentHistoryStore.PaymentHistory.subscribe(
            PaymentsHistoryItems => {
              if (PaymentsHistoryItems) {
                this.Payments = PaymentsHistoryItems;
                if (this.Payments[0].PaymentStatus === 'In Progress') {
                  this.LatestBillAmount = this.Payments[0].PaymentAmount;
                  this.LatestBillPaymentDate = this.Payments[0].PaymentDate;
                }
              }
            });
        }
        this.latestInvoiceDetailsSubscription = this.InvoiceStore.LatestInvoiceDetails.subscribe(
          latestInvoice => {
            if (!latestInvoice) {
              return;
            }
            this.latestInvoice = latestInvoice;
            console.log('Latest invoice', this.latestInvoice);
            this.exceededDueDate = this.activeServiceAccount.Past_Due > 0 ? true : false;
            console.log('Exceeded due date', this.exceededDueDate);
          }
        );
        // this.invoiceServiceSubscription = this.invoiceService.getLatestInvoice(this.activeServiceAccount.Id).subscribe(
        //   latestInvoice => {
        //     this.latestInvoice = latestInvoice;
        //     console.log('Latest invoice', this.latestInvoice);
        //     this.exceededDueDate = this.activeServiceAccount.Past_Due > 0 ? true : false;
        //     console.log('Exceeded due date', this.exceededDueDate);
        //   }
        // );
      }
    );
  }

  ngOnDestroy() {
    this.activeServiceAccountSubscription.unsubscribe();
    if (this.latestInvoiceDetailsSubscription) {
      this.latestInvoiceDetailsSubscription.unsubscribe();
    }
  }
}
