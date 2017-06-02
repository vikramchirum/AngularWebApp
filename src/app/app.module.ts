import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './shared/user.service';
import { BillService } from 'services/Bill';
import { AuthenticatedModule } from './authenticated/authenticated.module';
import { RegisterComponent } from './register/register.component';
import { EqualValidator } from './register/equal-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EqualValidator
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AuthenticatedModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    BillService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
