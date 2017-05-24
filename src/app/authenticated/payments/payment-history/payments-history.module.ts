import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { payment_history_routes } from './payment-history.routing.module';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';
import { PaymentHistoryBillsComponent } from './payment-history-bills/payment-history-bills.component';
import { PaymentHistoryPaymentsComponent } from './payment-history-payments/payment-history-payments.component';
import { PaymentHistoryComponent } from './payment-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    payment_history_routes,
    CommonModule,
    Ng2TableModule,
    FormsModule,
    MaterialModule,
    MdNativeDateModule,
    ReactiveFormsModule,
    PaginationModule.forRoot()
  ],
  declarations: [
    PaymentHistoryComponent,
    PaymentHistoryPaymentsComponent,
    PaymentHistoryBillsComponent
  ]
})
export class PaymentsHistoryModule { }
