import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { payment_history_routes } from './payment-history.routing.module';
import { BillsComponent } from './bills/bills.component';
import { PaymentsComponent } from './payments/payments.component';
import { LedgerComponent } from './ledger/ledger.component';
import { PaymentHistoryComponent } from './payment-history.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    payment_history_routes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    PaymentHistoryComponent,
    PaymentsComponent,
    BillsComponent,
    LedgerComponent
  ]
})
export class PaymentsHistoryModule { }
