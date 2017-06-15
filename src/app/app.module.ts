import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import {TooltipDirective} from 'ng2-tooltip-directive/components';
//import { ToolTipModule } from 'angular2-tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './core/user.service';
import { AuthenticatedModule } from './authenticated/authenticated.module';
import { RegisterComponent } from './register/register.component';
import { EqualValidator } from './register/equal-validator.directive';
import { CoreModule } from './core/core.module';
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
    ReactiveFormsModule,
    HttpModule,
    AuthenticatedModule,
    AppRoutingModule,
    CoreModule,
    TooltipModule.forRoot()
  ],
  exports: [
    ReactiveFormsModule
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
