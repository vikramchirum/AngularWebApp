import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './shared/user.service';
import { AuthenticatedModule } from './authenticated/authenticated.module';
import { RegisterComponent } from './register/register.component';
import { EqualValidator } from "./register/equal-validator.directive";
import { ReferralOptionsComponent } from './my-account/refer-friend/referral-options/referral-options.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EqualValidator,
    ReferralOptionsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    //ReactiveFormsModule,
    HttpModule,
    AuthenticatedModule,
    AppRoutingModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
