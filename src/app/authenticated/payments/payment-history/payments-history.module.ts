import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { payment_history_routes } from './payment-history.routing.module';
import { BillsComponent } from './bills/bills.component';
import { PaymentsComponent } from './payments/payments.component';
import { LedgerComponent } from './ledger/ledger.component';
import { PaymentHistoryComponent } from './payment-history.component';
import { SharedModule } from 'app/shared/shared.module';
import { ViewMyBillModalComponent } from './view-my-bill-modal/view-my-bill-modal.component';
import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  exports: [ ViewMyBillModalComponent, NgxPaginationModule ],
  imports: [
    payment_history_routes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [
    PaymentHistoryComponent,
    PaymentsComponent,
    BillsComponent,
    LedgerComponent,
    ViewMyBillModalComponent
  ]
})
export class PaymentsHistoryModule { }
