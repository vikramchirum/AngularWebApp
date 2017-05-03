
import {Route, RouterModule} from "@angular/router";
import {PaymentHistoryComponent} from "./payment-history/payment-history.component";

const routes: Route[] = [
  {path: '', component: PaymentHistoryComponent}
];

export const payment_routes = RouterModule.forChild(routes);
