
import { RouterModule, Route } from '@angular/router';

import { RedirectLoggedInUserToHome } from 'app/core/user.service';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RecoverUsernameComponent } from './recover-username/recover-username.component';
import {AutoLoginComponent } from './auto-login/auto-login.component';
import { TduChargesComponent } from "./tdu_charges/tdu_charges.component";

const routes: Route[] = [
  {
    path: 'auto-login', component: AutoLoginComponent,
  },
  {
    path: 'login', component: LoginComponent,
    canActivate: [RedirectLoggedInUserToHome]
  },
  {
    path: 'login/recover-password', component: RecoverPasswordComponent,
    canActivate: [RedirectLoggedInUserToHome]
  },
  {
    path: 'login/recover-username', component: RecoverUsernameComponent,
    canActivate: [RedirectLoggedInUserToHome]
  },
  {
    path: 'tdu-charges', component: TduChargesComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

export const guest_routes = RouterModule.forChild(routes);
