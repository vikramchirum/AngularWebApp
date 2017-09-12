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
import { NotificationOptionsService } from './notificationoptions.service';
import { DocumentsService } from './documents.service';
import { RenewalService } from './renewal.service';
import { RenewalStore } from './store/RenewalStore';
import {OffersStore} from './store/OffersStore';
import { MessageCenterService } from './messagecenter.service';

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
    NotificationOptionsService,
    DocumentsService,
    RenewalService,
    RenewalStore,
    OffersStore,
    MessageCenterService
  ]
})
export class CoreModule { }
