import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import {Routes, RouterModule} from "@angular/router";
import {payment_routes} from "./payments-routing.module";

@NgModule({
  imports: [
    payment_routes,
    CommonModule
  ],
  declarations: [PaymentHistoryComponent]
})
export class PaymentsModule {
}
