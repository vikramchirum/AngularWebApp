import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { payment_routes } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';

@NgModule({
  imports: [
    payment_routes,
    CommonModule
  ],
  declarations: [
    PaymentsComponent,
    ViewMyBillComponent,
    PaymentAccountsComponent,
    MakePaymentComponent
  ]
})
export class PaymentsModule { }
