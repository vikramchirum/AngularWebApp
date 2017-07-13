import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomFormsModule } from 'ng2-validation';
import { SharedModule } from 'app/shared/shared.module';
import { payment_options_routes } from './payment-options-routing.module';
import { PaymentOptionsComponent } from './payment-options.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './payment-extension/payment-extension.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BudgetBillingSelectorComponent } from './budget-billing/budget-billing-selector.component';

@NgModule({
  imports: [
    payment_options_routes,
    ReactiveFormsModule,
    CustomFormsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    PaymentOptionsComponent,
    AutoBillPaymentComponent,
    BudgetBillingComponent,
    BudgetBillingSelectorComponent,
    PaymentExtensionComponent
  ]
})
export class PaymentOptionsModule { }
