import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChangeUserNameComponent } from './components/change-user-name/change-user-name.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeEmailAddressComponent } from './components/change-email-address/change-email-address.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { ChangeAddressComponent } from './components/change-address/change-address.component';
import { ServiceAccountSelectorComponent } from './components/service-account-selector/service-account-selector.component';
import { PaymentMethodSelectorComponent } from './components/payment-method-selector/payment-method-selector.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { PhonePipe } from './pipes/phone.pipe';
import { NumberToMoneyPipe } from './pipes/NumberToMoney.pipe';
import { LeftNavPanelComponent } from './components/left-nav-panel/left-nav-panel.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  declarations: [
    ChangeUserNameComponent,
    ChangePasswordComponent,
    ChangeEmailAddressComponent,
    StatusBarComponent,
    ChangeAddressComponent,
    ServiceAccountSelectorComponent,
    PaymentMethodSelectorComponent,
    CreditCardComponent,
    PhonePipe,
    NumberToMoneyPipe,
    LeftNavPanelComponent
  ],
  exports: [
    ChangeUserNameComponent,
    ChangePasswordComponent,
    ChangeEmailAddressComponent,
    StatusBarComponent,
    ChangeAddressComponent,
    ServiceAccountSelectorComponent,
    PaymentMethodSelectorComponent,
    CreditCardComponent,
    PhonePipe,
    NumberToMoneyPipe,
    LeftNavPanelComponent
  ]
})
export class SharedModule { }
