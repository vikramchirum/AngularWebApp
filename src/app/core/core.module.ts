/**
 * Created by vikram.chirumamilla on 6/20/2017.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { HttpClient } from './httpclient';
import { httpFactory } from './httpFactory';

import { AutoBillPayService } from './auto-bill-pay.service';
import { BillService } from './Bill';
import { BillingAccountService } from './BillingAccount.service';
import { CustomerAccountService } from './CustomerAccount.service';
import { PaymethodService } from './Paymethod.service';
import { InvoiceService } from './invoiceservice.service';
import { BudgetBillingService } from './budgetbilling.service';

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
    AutoBillPayService,
    BillService,
    BillingAccountService,
    CustomerAccountService,
    PaymethodService,
    InvoiceService,
    BudgetBillingService
  ]
})
export class CoreModule {
}
