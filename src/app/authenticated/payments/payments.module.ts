import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { payment_routes } from './payments-routing.module';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { PreferenceComponent } from './view-my-bill/preference/preference.component';
import { BillService } from 'services/Bill';
import { BillingAccountService } from 'services/BillingAccount';
import { NumberToMoneyPipe } from 'pipes/NumberToMoney.pipe';
import { PaymentsComponent } from './payments.component';
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { PaymentOptionsModule } from './payment-options/payment-options.module';
import { MakePaymentComponent } from './make-payment/make-payment.component';

@NgModule({
  imports: [
    CommonModule,
    payment_routes,
    PaymentOptionsModule
  ],
  declarations: [
    PaymentsComponent,
    ViewMyBillComponent,
    PreferenceComponent,
    MakePaymentComponent,
    PaymentAccountsComponent,
    NumberToMoneyPipe
  ],
  providers: [
    BillService,
    BillingAccountService
  ]
})
export class PaymentsModule { }
