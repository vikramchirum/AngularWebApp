import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RecoverUsernameComponent } from './recover-username/recover-username.component';
import { RegisterComponent } from './register/register.component';
import { guest_routes } from './guest-routing.module';

@NgModule({
  imports: [
    guest_routes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RecoverPasswordComponent,
    RecoverUsernameComponent,
    RegisterComponent
  ],
  exports: [
    RouterModule
  ]
})
export class GuestModule { }
