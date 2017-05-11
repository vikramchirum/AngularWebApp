
import {Route, RouterModule} from "@angular/router";
import {PaymentHistoryComponent} from "./payment-history/payment-history.component";
import { PaymentsComponent } from './payments.component';
import { ViewMyBillComponent } from './view-my-bill/view-my-bill.component';
import { AutoBillPaymentComponent } from './auto-bill-payment/auto-bill-payment.component';
import { BudgetBillingComponent } from './budget-billing/budget-billing.component';
import { PaymentExtensionComponent } from './payment-extension/payment-extension.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';

const routes: Route[] = [
  {path: '', component: PaymentsComponent,
  children: [
    {path:'payment-history', component: PaymentHistoryComponent},
    {path:'view-my-bill', component: ViewMyBillComponent},
    {path:'auto-bill-payment', component: AutoBillPaymentComponent},
    {path:'budget-billing', component: BudgetBillingComponent},
    {path:'payment-extension', component: PaymentExtensionComponent} ,
    {path:'make-payment', component:MakePaymentComponent} 
  ]}
];

export const payment_routes = RouterModule.forChild(routes);

