import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { UserService, RedirectLoggedInUserToHome } from './core/user.service';
import { GuestModule } from './guest/guest.module';
import { AuthenticatedModule } from './authenticated/authenticated.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AuthenticatedModule,
    GuestModule,
    AppRoutingModule,
    CoreModule,
    TooltipModule.forRoot()
  ],
  exports: [
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    RedirectLoggedInUserToHome
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
