
import { Route, RouterModule } from '@angular/router';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentsComponent } from './payments.component';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { PaymentAccountsComponent } from './payment-accounts/payment-accounts.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './payment-extension/payment-extension.component';
import { PaymentsHistoryModule } from './payment-history/payments-history.module';


export function loadPaymentHistoryModule() {
  return PaymentsHistoryModule;
};

const routes: Route[] = [
  {
    path: '', component: PaymentsComponent,
    children: [
      { path: 'view-my-bill', component: ViewMyBillComponent },
      { path: 'make-payment', component: MakePaymentComponent },
      { path: 'payment-accounts', component: PaymentAccountsComponent  },
      { path: 'payment-options', component: PaymentOptionsComponent },
      { path: 'payment-history', loadChildren: loadPaymentHistoryModule }
    ]
  }
];

export const payment_routes = RouterModule.forChild(routes);

