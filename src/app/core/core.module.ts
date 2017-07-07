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
import { PaymentMethodService } from './PaymentMethod';
import { InvoiceService } from './invoiceservice.service';

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
    PaymentMethodService,
    InvoiceService
  ]

})
export class CoreModule { }
