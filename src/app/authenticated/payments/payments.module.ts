import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import {Routes, RouterModule} from "@angular/router";
import {payment_routes} from "./payments-routing.module";
import { PaymentsComponent } from './payments.component';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './payment-extension/payment-extension.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { PaymentHistoryBillsComponent } from './payment-history/payment-history-bills/payment-history-bills.component';
import { PaymentHistoryPaymentsComponent } from './payment-history/payment-history-payments/payment-history-payments.component';

@NgModule({
  imports: [
    payment_routes,
    CommonModule
  ],
  declarations: [PaymentHistoryComponent, PaymentsComponent, ViewMyBillComponent, AutoBillPaymentComponent, BudgetBillingComponent, PaymentExtensionComponent, MakePaymentComponent, PaymentHistoryBillsComponent, PaymentHistoryPaymentsComponent]
})
export class PaymentsModule {
}
