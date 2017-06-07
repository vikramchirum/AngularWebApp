
import { Route, RouterModule } from '@angular/router';

import { PaymentsComponent } from './payments.component';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { PaymentOptionsModule } from './payment-options/payment-options.module';
import { PaymentsHistoryModule } from './payment-history/payments-history.module';

export function loadPaymentOptionsModule() { return PaymentOptionsModule; }

export function loadPaymentHistoryModule() { return PaymentsHistoryModule; }

const routes: Route[] = [
  {
    path: '', component: PaymentsComponent,
    children: [
      { path: 'view-my-bill', component: ViewMyBillComponent },
      { path: 'make-payment', component: MakePaymentComponent },
      { path: 'payment-accounts', component: PaymentAccountsComponent  },
      { path: 'payment-options', loadChildren: loadPaymentOptionsModule },
      { path: 'payment-history', loadChildren: loadPaymentHistoryModule }
    ]
  }
];

export const payment_routes = RouterModule.forChild(routes);

