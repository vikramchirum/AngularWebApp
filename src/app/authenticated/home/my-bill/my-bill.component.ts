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
    showDueDate: boolean = null;

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
          this.exceededDueDate =  this.totalDue > 0 ? true : false;
          this.paymentHistorySubscription = this.PaymentHistoryStore.PaymentHistory.subscribe(
            PaymentsHistoryItems => {
              if (PaymentsHistoryItems) {
                this.Payments = PaymentsHistoryItems;
                // console.log('payments', this.Payments);
                this.paymentStatus = this.Payments[0].PaymentStatus;
                if (this.paymentStatus === 'In Progress' || this.paymentStatus === 'Cleared') {
                  this.LatestBillAmount = this.Payments[0].PaymentAmount;
                  this.LatestBillPaymentDate = this.Payments[0].PaymentDate;
                  this.showDueDate = false;
                } else {
                  this.showDueDate = true;
                }
                this.latestInvoiceDetailsSubscription = this.InvoiceStore.LatestInvoiceDetails.subscribe(
                  latestInvoice => {
                    if (!latestInvoice) {
                      return;
                    }
                    this.latestInvoice = latestInvoice;
                    this.dueDate = new Date(latestInvoice.Due_Date);
                    this.dueDate.setDate(this.dueDate.getDate() + 1);
                    // this.exceededDueDate = (this.dueDate < new Date() && this.pastDue > 0) ? true : false;
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
      // console.log('autoPay', this.autoPay);
      if (this.exceededDueDate) {
        if (!this.autoPay) {
          if ( this.paymentStatus === 'In Progress' ) {
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

    console.log('currentView', this.currentView);
  }

  ngOnDestroy() {
    this.activeServiceAccountSubscription.unsubscribe();
    if (this.latestInvoiceDetailsSubscription) {
      this.latestInvoiceDetailsSubscription.unsubscribe();
    }
  }
}
