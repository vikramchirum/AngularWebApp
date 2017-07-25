/**
 * Created by vikram.chirumamilla on 6/20/2017.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { HttpClient } from './httpclient';
import { httpFactory } from './httpFactory';

import { AddressSearchService } from './addresssearch.service';
import { AutoBillPayService } from './auto-bill-pay.service';
import { BillService } from './Bill';
import { BillingAccountService } from './BillingAccount.service';
import { BudgetBillingService } from './budgetbilling.service';
import { CustomerAccountService } from './CustomerAccount.service';
import { InvoiceService } from './invoiceservice.service';
import { OfferService } from './offer.service';
import { PaymentsHistoryService } from './payments-history.service';
import { PaymentsService } from './payments.service';
import { PaymethodService } from './Paymethod.service';
import { UsageHistoryService } from './usage-history.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [
    {
      provide: HttpClient,
      useFactory: httpFactory,
      deps: [ XHRBackend, RequestOptions ]
    },
    AddressSearchService,
    AutoBillPayService,
    BillService,
    BillingAccountService,
    BudgetBillingService,
    CustomerAccountService,
    InvoiceService,
    OfferService,
    PaymentsHistoryService,
    PaymentsService,
    PaymethodService,
    UsageHistoryService
  ]
})
export class CoreModule { }
