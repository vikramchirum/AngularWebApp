
import { Route, RouterModule } from '@angular/router';
import { PaymentOptionsComponent } from './payment-options.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './payment-extension/payment-extension.component';

const routes: Route[] = [
  {
    path: '', component: PaymentOptionsComponent,
    children: [
      { path: 'auto-bill-payment', component: AutoBillPaymentComponent },
      { path: 'budget-billing', component: BudgetBillingComponent },
      { path: 'payment-extension', component: PaymentExtensionComponent  }
    ]
  }
];

export const payment_options_routes = RouterModule.forChild(routes);

