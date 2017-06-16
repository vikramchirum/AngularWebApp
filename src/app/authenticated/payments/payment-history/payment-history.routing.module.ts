
import { Route, RouterModule } from '@angular/router';

import { BillsComponent } from './bills/bills.component';
import { PaymentsComponent } from './payments/payments.component';
import { LedgerComponent } from './ledger/ledger.component';
import { PaymentHistoryComponent } from './payment-history.component';

const routes: Route[] = [
  {
    path: '', component: PaymentHistoryComponent,
    children: [
      { path: 'bills', component: BillsComponent },
      { path: 'ledger', component: LedgerComponent },
      { path: 'payments', component: PaymentsComponent }
    ]
  }
];

export const payment_history_routes = RouterModule.forChild(routes);
