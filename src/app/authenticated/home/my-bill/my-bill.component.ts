/**
 * Created by vikram.chirumamilla on 7/31/2017.
 */
import { Component, OnDestroy, OnInit} from '@angular/core';

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
   pastDue: number;
   exceededDueDate: boolean = null;
   activeServiceAccount: ServiceAccount;
   latestInvoice: IInvoice;
   autoPay: boolean;
   paymentStatus: string = null;
   currentView: string = null;
   dueDate: Date = null;
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
        if (activeServiceAccount) {
          this.activeServiceAccount = activeServiceAccount;
          this.pastDue = activeServiceAccount.Past_Due;
          this.totalDue = activeServiceAccount.Current_Due + activeServiceAccount.Past_Due;
          this.autoPay = activeServiceAccount.Is_Auto_Bill_Pay;
          // this.exceededDueDate =  (new Date(this.activeServiceAccount.Due_Date) > new Date()) ? true : false;
          this.paymentHistorySubscription = this.PaymentHistoryStore.PaymentHistory.subscribe(
            PaymentsHistoryItems => {
              if (PaymentsHistoryItems) {
                this.Payments = PaymentsHistoryItems;
                console.log('payments', this.Payments);
                this.paymentStatus = this.Payments[0].PaymentStatus;
                if (this.paymentStatus === 'In Progress') {
                  this.LatestBillAmount = this.Payments[0].PaymentAmount;
                  this.LatestBillPaymentDate = this.Payments[0].PaymentDate;
                }
                this.latestInvoiceDetailsSubscription = this.InvoiceStore.LatestInvoiceDetails.subscribe(
                  latestInvoice => {
                    if (!latestInvoice) {
                      return;
                    }
                    this.latestInvoice = latestInvoice;
                    this.dueDate = new Date(latestInvoice.Due_Date);
                    this.dueDate.setDate(this.dueDate.getDate() + 1);
                    this.exceededDueDate = (this.dueDate < new Date() && this.pastDue > 0) ? true : false;
                    console.log('exceededDueDate', this.dueDate < new Date() );
                    console.log('past due', this.pastDue );
                    console.log('due date', this.dueDate );
                  }
                );
                this.setFlags();
              }
            });
        }
      }
  );
  }

  setFlags() {
    if (this.activeServiceAccount) {
      if (this.exceededDueDate) {
        if (!this.autoPay) {
          if (this.paymentStatus === 'Cleared') {
            this.currentView = 'MakePayment';
          } else if ( this.paymentStatus === 'In Progress' ) {
            this.currentView = 'PaymentPending';
          } else {
            this.currentView = 'PastDuePayNow';
          }
        } else {
          if (this.paymentStatus === 'Cleared') {
            this.currentView = 'MakePayment';
          } else {
            this.currentView = 'AutoPay';
          }
        }
      } else {
        if (!this.autoPay) {
          if (this.paymentStatus === 'In Progress') {
            this.currentView = 'PaymentPending';
          } else {
            this.currentView = 'MakePayment';
          }
        } else {
          if (this.paymentStatus === 'Cleared') {
            this.currentView = 'MakePayment';
          } else {
            this.currentView = 'AutoPay';
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.activeServiceAccountSubscription.unsubscribe();
    if (this.latestInvoiceDetailsSubscription) {
      this.latestInvoiceDetailsSubscription.unsubscribe();
    }
  }
}
