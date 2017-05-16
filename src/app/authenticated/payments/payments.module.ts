import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { payment_routes } from "./payments-routing.module";
import { PaymentsComponent } from './payments.component';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './payment-extension/payment-extension.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';

@NgModule({
  imports: [
    payment_routes,
    CommonModule
  ],
  declarations: [PaymentsComponent, ViewMyBillComponent, AutoBillPaymentComponent, BudgetBillingComponent, PaymentExtensionComponent, MakePaymentComponent]
})
export class PaymentsModule {
}
