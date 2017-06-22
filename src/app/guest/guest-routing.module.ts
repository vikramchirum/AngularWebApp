
import { RouterModule, Route } from '@angular/router';

import { RedirectLoggedInUserToHome } from 'app/core/user.service';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RecoverUsernameComponent } from './recover-username/recover-username.component';
import { RegisterComponent } from './register/register.component';

const routes: Route[] = [
  { path: 'register', component: RegisterComponent },
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
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

export const guest_routes = RouterModule.forChild(routes);
