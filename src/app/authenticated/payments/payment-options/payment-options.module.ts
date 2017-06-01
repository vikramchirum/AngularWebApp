import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { payment_options_routes } from './payment-options-routing.module';
import { PaymentOptionsComponent } from './payment-options.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './/payment-extension/payment-extension.component';

@NgModule({
  imports: [
    payment_options_routes,
    CommonModule
  ],
  declarations: [
    PaymentOptionsComponent,
    AutoBillPaymentComponent,
    BudgetBillingComponent,
    PaymentExtensionComponent
  ]
})
export class PaymentOptionsModule { }
