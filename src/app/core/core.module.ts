
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillService } from './Bill';
import { BillingAccountService } from './BillingAccount';
import { CustomerAccountService } from './CustomerAccount';
import { PaymentMethodService } from './PaymentMethod';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [
    BillService,
    BillingAccountService,
    CustomerAccountService,
    PaymentMethodService
  ]
})
export class CoreModule { }
