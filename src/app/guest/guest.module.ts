import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RecoverUsernameComponent } from './recover-username/recover-username.component';
import { guest_routes } from './guest-routing.module';
import { LoginRegisterModalComponent } from './login/login-register-modal/login-register-modal.component';
import { LoginAddClaimsModalComponent } from './login/login-add-claims-modal/login-add-claims-modal.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { TduChargesComponent } from "./tdu_charges/tdu_charges.component";

@NgModule({
  imports: [
    guest_routes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    RecoverPasswordComponent,
    RecoverUsernameComponent,
    LoginRegisterModalComponent,
    LoginAddClaimsModalComponent,
    AutoLoginComponent,
    TduChargesComponent
  ],
  exports: [
    RouterModule
  ]
})
export class GuestModule { }
