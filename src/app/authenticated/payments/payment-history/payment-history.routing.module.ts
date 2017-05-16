
import { Route, RouterModule } from "@angular/router";
import { PaymentHistoryBillsComponent } from "./payment-history-bills/payment-history-bills.component";
import { PaymentHistoryPaymentsComponent } from './payment-history-payments/payment-history-payments.component';
import { PaymentHistoryComponent } from './payment-history.component';

const routes: Route[] = [
  {
    path: '', component: PaymentHistoryComponent,
    children: [
      { path: 'bills', component: PaymentHistoryBillsComponent },
      { path: 'payments', component: PaymentHistoryPaymentsComponent },
    ]
  }
];

export const payment_history_routes = RouterModule.forChild(routes);

