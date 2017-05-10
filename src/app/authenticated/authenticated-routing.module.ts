
/**
 * Created by patrick.purcell on 5/3/2017.
 */

import {RouterModule, Route} from "@angular/router";
import {RootComponent} from "./root/root.component";
import {UserService} from "../shared/user.service";
import {PaymentsModule} from "./payments/payments.module";
import {MyAccountModule} from "./my-account/my-account.module";
import {HomeModule} from "./home/home.module";

export function loadHomeModule(){
  return HomeModule;
};

export function loadMyAccountModule(){
  return MyAccountModule;
};

export function loadPaymentModule(){
  return PaymentsModule;
};

const routes: Route[] = [
  {
    path: '',
    component: RootComponent,
    canActivate: [UserService],
    children: [
      // {path:'home',  loadChildren: 'app/authenticated/home/home.module#HomeModule'},
      // {path: 'account', loadChildren: 'app/authenticated/my-account/my-account.module#MyAccountModule'},
      // {path: 'payments', loadChildren: 'app/authenticated/payments/payments.module#PaymentsModule'}
    
      {path:'home',  loadChildren: loadHomeModule},
      {path: 'account', loadChildren: loadMyAccountModule},
      {path: 'payments', loadChildren: loadPaymentModule}
    ]
  }
];

export const authenticated_routes = RouterModule.forChild(routes);