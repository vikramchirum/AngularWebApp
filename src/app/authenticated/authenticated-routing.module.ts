/**
 * Created by patrick.purcell on 5/3/2017.
 */

import {RouterModule, Routes} from "@angular/router";
import {RootComponent} from "./root/root.component";
import {UserService} from "../shared/user.service";
import {PaymentsModule} from "./payments/payments.module";
import {MyAccountModule} from "./my-account/my-account.module";
import {HomeModule} from "./home/home.module";

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivate: [UserService],
    children: [
      {path:'home',  loadChildren: () => HomeModule},
      {path: 'my-account', loadChildren: () => MyAccountModule},
      {path: 'payments', loadChildren: () => PaymentsModule}
    ]
  }
];

export const authenticated_routes = RouterModule.forChild(routes);
