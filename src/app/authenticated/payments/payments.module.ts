import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { payment_routes } from './payments-routing.module';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { PreferenceComponent } from './view-my-bill/preference/preference.component';
import { CurrentChargesComponent } from './components/current-charges.component';
import { PaymentsComponent } from './payments.component';
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { PaymentOptionsModule } from './payment-options/payment-options.module';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { SharedModule } from 'app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    payment_routes,
    PaymentOptionsModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    PaymentsComponent,
    ViewMyBillComponent,
    PreferenceComponent,
    CurrentChargesComponent,
    MakePaymentComponent,
    PaymentAccountsComponent
  ],
  providers: [ DatePipe, CurrencyPipe ]
})
export class PaymentsModule { }
