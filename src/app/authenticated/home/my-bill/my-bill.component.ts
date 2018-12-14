/**
 * Created by vikram.chirumamilla on 7/31/2017.
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { InvoiceStore } from 'app/core/store/invoicestore';
import { PaymentsHistoryStore } from 'app/core/store/paymentsstore';
import { PaymentsHistory } from 'app/core/models/payments/payments-history.model';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

@Component({
  selector: 'mygexa-my-bill',
  templateUrl: './my-bill.component.html',
  styleUrls: ['./my-bill.component.scss']
})
export class MyBillComponent implements OnInit, OnDestroy {

  @Input('parentComponent')
  public parentComponent: string = null;

  dollarAmountFormatter: string;
  totalDue: number;
  pastDue: number;
  exceededDueDate: boolean = null;
  pastDueExists: boolean = null;
  activeServiceAccount: ServiceAccount;
  latestInvoice: IInvoice;
  autoPay: boolean;
  paymentStatus: string = null;
  currentView: string = null;
  dueDate: Date = null;
  public Payments: PaymentsHistory[] = null;
  LatestBillAmount: number;
  LatestBillPaymentDate: Date = null;
  ScheduledAutoBillPaymentDate: Date = null;
  showDueDate: boolean = null;
  PaymentsLength: number = null;
  private activeServiceAccountSubscription: Subscription = null;
  private latestInvoiceDetailsSubscription: Subscription = null;
  private paymentHistorySubscription: Subscription = null;

  constructor(private ServiceAccountService: ServiceAccountService,
              private InvoiceStore: InvoiceStore,
              private PaymentHistoryStore: PaymentsHistoryStore,
              private googleAnalyticsService: GoogleAnalyticsService) {
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
          this.pastDueExists = this.pastDue > 0 ? true : false;
          this.latestInvoiceDetailsSubscription = this.InvoiceStore.LatestInvoiceDetails.subscribe(
            latestInvoice => {
              if (!latestInvoice) {
                return;
              }
              this.latestInvoice = latestInvoice;
              this.dueDate = new Date(latestInvoice.Due_Date);
              this.dueDate.setDate(this.dueDate.getDate() + 1);
              this.exceededDueDate = (this.dueDate < new Date()) ? true : false;
              this.paymentHistorySubscription = this.PaymentHistoryStore.PaymentHistory.subscribe(
                PaymentsHistoryItems => {
                  if (PaymentsHistoryItems) {
                    this.Payments = PaymentsHistoryItems;
                    this.PaymentsLength = this.Payments.length;
                    if (this.Payments[0]) {
                      this.paymentStatus = this.Payments[0].PaymentStatus;
                      if (this.paymentStatus === 'In Progress' || this.paymentStatus === 'Cleared') {
                        this.LatestBillAmount = this.Payments[0].PaymentAmount;
                        this.LatestBillPaymentDate = this.Payments[0].PaymentDate;
                        this.showDueDate = false;
                      } else {
                        this.showDueDate = true;
                        
                      }
                      if (this.paymentStatus === 'Scheduled') {
                        this.ScheduledAutoBillPaymentDate = this.Payments[0].PaymentDate;
                        this.LatestBillAmount = this.Payments[0].PaymentAmount;
                      }
                    }
                  }
                  this.setFlags();
                });
            }
          );
        }
      }
    );
  }

  setFlags() {
    if (this.activeServiceAccount) {
      if (this.pastDueExists) {
        this.currentView = 'PastDuePayNow';
      } else {
        if (!this.autoPay) {
          if (this.paymentStatus === 'In Progress') {
            this.currentView = 'PaymentPending';
          } else {
            this.currentView = 'MakePayment';
          }
        } else {
          this.currentView = 'AutoPay';
        }
      }
      if (this.paymentStatus == 'Scheduled') {
        this.currentView = 'PaymentScheduled';
      }
    }
  }

  public handleClick() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[this.parentComponent], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.MakeAPaymentButton]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.MakeAPaymentButton]);
  }

  ngOnDestroy() {
    this.activeServiceAccountSubscription.unsubscribe();
    if (this.latestInvoiceDetailsSubscription) {
      this.latestInvoiceDetailsSubscription.unsubscribe();
    }
  }
}
