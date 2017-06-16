import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { payment_routes } from './payments-routing.module';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { PreferenceComponent } from './view-my-bill/preference/preference.component';
import { CurrentChargesComponent } from './components/current-charges.component';
import { ViewBillComponent } from './components/view-bill.component';
import { PaymentsComponent } from './payments.component';
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { PaymentOptionsModule } from './payment-options/payment-options.module';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    payment_routes,
    PaymentOptionsModule,
    SharedModule
  ],
  declarations: [
    PaymentsComponent,
    ViewMyBillComponent,
    PreferenceComponent,
    CurrentChargesComponent,
    ViewBillComponent,
    MakePaymentComponent,
    PaymentAccountsComponent
  ],
  providers: []
})
export class PaymentsModule { }
