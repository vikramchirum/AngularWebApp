/**
 * Created by vikram.chirumamilla on 6/20/2017.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { HttpClient } from './httpclient';
import { httpFactory } from './httpFactory';

import { BillService } from './Bill';
import { BillingAccountService } from './BillingAccount.service';
import { CustomerAccountService } from './CustomerAccount.service';
import { PaymethodService } from './Paymethod.service';
import { InvoiceService } from './invoiceservice.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  exports: [],
  providers: [
    {
      provide: HttpClient,
      useFactory: httpFactory,
      deps: [ XHRBackend, RequestOptions ]
    },
    BillService,
    BillingAccountService,
    CustomerAccountService,
    PaymethodService,
    InvoiceService
  ]

})
export class CoreModule { }
