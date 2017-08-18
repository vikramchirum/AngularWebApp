/**
 * Created by vikram.chirumamilla on 6/20/2017.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { HttpClientService } from './httpclient';
import { AddressSearchService } from './addresssearch.service';
import { AutoPaymentConfigService } from './auto-payment-config.service';
import { ServiceAccountService } from './serviceaccount.service';
import { BudgetBillingService } from './budgetbilling.service';
import { CustomerAccountService } from './CustomerAccount.service';
import { InvoiceService } from './invoiceservice.service';
import { OfferService } from './offer.service';
import { OrderStatusService } from './order-status.service';
import { PaymentsHistoryService } from './payments-history.service';
import { PaymentsService } from './payments.service';
import { PaymethodService } from './Paymethod.service';
import { UsageHistoryService } from './usage-history.service';
import { RenewalService } from './renewal.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [
    HttpClientService,
    AddressSearchService,
    AutoPaymentConfigService,
    ServiceAccountService,
    BudgetBillingService,
    CustomerAccountService,
    InvoiceService,
    OfferService,
    OrderStatusService,
    PaymentsHistoryService,
    PaymentsService,
    PaymethodService,
    UsageHistoryService,
    RenewalService
  ]
})
export class CoreModule { }
