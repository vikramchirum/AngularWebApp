import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalModule, PopoverModule  } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { CustomFormsModule } from 'ng2-validation';
import { ChangeUserNameComponent } from './components/change-user-name/change-user-name.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeEmailAddressComponent } from './components/change-email-address/change-email-address.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { ChangeAddressComponent } from './components/change-address/change-address.component';
import { ServiceAccountSelectorComponent } from './components/service-account-selector/service-account-selector.component';
import { PaymethodSelectorComponent } from './components/payment-method-selector/payment-method-selector.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';

import { PhonePipe } from './pipes/phone.pipe';
import { NumberToMoneyPipe } from './pipes/NumberToMoney.pipe';
import { FloatToMoneyPipe } from './pipes/FloatToMoney.pipe';

import { LeftNavPanelComponent } from './components/left-nav-panel/left-nav-panel.component';
import { ChangePhoneNumberComponent } from './components/change-phone-number/change-phone-number.component';
import { PaymethodAddCcComponent } from './components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from './components/payment-method-add-echeck/payment-method-add-echeck.component';
import { ViewBillComponent } from './components/view-bill/view-bill.component';
import { DollarToCentsPipe } from './pipes/DollarToCents.pipe';
import { AddressSearchComponent } from './components/address-search/address-search.component';
import { PhoneDirective } from './directives/phone.directive';
import { PhoneNumberConfirmationModalComponent } from './components/phone-number-confirmation-modal/phone-number-confirmation-modal.component';
import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { OfferDetailsPopoverComponent } from './components/offer-details-popover/offer-details-popover.component';
import { AddPaymentAccountsComponent } from './components/add-payment-accounts/add-payment-accounts.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { ViewBillDetailsComponent } from './components/view-bill-details/view-bill-details.component';
import { PlayCardComponent } from './components/play-card/play-card.component';
import { PaymentConfirmationModalComponent } from './components/payment-confirmation-modal/payment-confirmation-modal.component';
import { PaymentMethodEditCcComponent } from './components/payment-method-edit-cc/payment-method-edit-cc.component';
import { RtpSavingsDetailsComponent } from './components/rtp-savings-details/rtp-savings-details.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ChartsModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  declarations: [
    ChangeUserNameComponent,
    ChangePasswordComponent,
    ChangeEmailAddressComponent,
    StatusBarComponent,
    ChangeAddressComponent,
    ServiceAccountSelectorComponent,
    PaymethodSelectorComponent,
    CreditCardComponent,
    PhonePipe,
    NumberToMoneyPipe,
    FloatToMoneyPipe,
    LeftNavPanelComponent,
    ChangePhoneNumberComponent,
    PaymethodAddCcComponent,
    PaymethodAddEcheckComponent,
    ViewBillComponent,
    DollarToCentsPipe,
    AddressSearchComponent,
    PhoneDirective,
    PhoneNumberConfirmationModalComponent,
    PlanCardComponent,
    OfferDetailsPopoverComponent,
    AddPaymentAccountsComponent,
    ErrorModalComponent,
    ViewBillDetailsComponent,
    PaymentConfirmationModalComponent,
    PlayCardComponent,
    PaymentMethodEditCcComponent,
    RtpSavingsDetailsComponent
  ],
  exports: [
    ChangeUserNameComponent,
    ChangePasswordComponent,
    ChangeEmailAddressComponent,
    StatusBarComponent,
    ChangeAddressComponent,
    ServiceAccountSelectorComponent,
    PaymethodSelectorComponent,
    CreditCardComponent,
    PhonePipe,
    NumberToMoneyPipe,
    FloatToMoneyPipe,
    LeftNavPanelComponent,
    ChangePhoneNumberComponent,
    PaymethodAddCcComponent,
    PaymethodAddEcheckComponent,
    ViewBillComponent,
    DollarToCentsPipe,
    AddressSearchComponent,
    PhoneDirective,
    PlanCardComponent,
    OfferDetailsPopoverComponent,
    AddPaymentAccountsComponent,
    ErrorModalComponent,
    ViewBillDetailsComponent,
    PaymentConfirmationModalComponent,
    PlayCardComponent,
    PaymentMethodEditCcComponent,
    RtpSavingsDetailsComponent
  ]
})
export class SharedModule { }
