import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { validateEmail, equalityCheck } from 'app/validators/validator';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { CustomerAccountStore } from 'app/core/store/CustomerAccountStore';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

import { UserService } from 'app/core/user.service';
import { IUser } from 'app/core/models/user/User.model';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';

@Component({
  selector: 'mygexa-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrls: ['./change-email-address.component.scss']
})
export class ChangeEmailAddressComponent implements OnInit {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  IsResetSuccessful: boolean = null;
  changeEmailForm: FormGroup = null;
  submitAttempt: boolean = null;
  IsError: boolean = null;
  errorMessage: string = null;
  Exiting_CustomerDetails: CustomerAccount = null;
  CustomerAccountServiceSubscription: Subscription = null;
  updateUser: IUser = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService,
    private CustomerAccountService: CustomerAccountService,
    private CustomerAccountStore: CustomerAccountStore,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.IsResetSuccessful = false;
    this.changeEmailForm = this.changeEmailFormInit();
  }

  changeEmailFormInit(): FormGroup {
    return this.FormBuilder.group(
      {
        email: [null, Validators.compose([Validators.required, validateEmail])],
        confirmEmail: [null, Validators.compose([Validators.required, validateEmail])]
      },
      {
        validator: equalityCheck('email', 'confirmEmail')
      }
    );
  }

  ngOnInit() {
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => { this.Exiting_CustomerDetails = result; }
    );
  }

  submitForm() {

    this.submitAttempt = true;
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UpdateEmailAddress]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UpdateEmailAddress]);

    if (this.changeEmailForm.valid) {
      this.UserService.updateEmailAddress(this.changeEmailForm.get('email').value).subscribe(
        result => {
          this.IsResetSuccessful = result;
          if (result) {
            this.Exiting_CustomerDetails.Email = this.changeEmailForm.get('email').value;
            console.log('Updating data', this.Exiting_CustomerDetails);
            // reload customer data
            this.CustomerAccountStore.UpdateCustomerDetails(this.Exiting_CustomerDetails);
            this.updateUser = this.UserService.UserCache;
            this.updateUser.Profile.Email_Address = this.changeEmailForm.get('email').value;
            this.UserService.updateUserInMongo(this.updateUser);
            this.resetForm();
          } else {
            // show error message
            this.errorMessage = result;
            this.IsError = true;
          }
        });
    }
  }

  resetForm() {
    this.IsResetSuccessful = null;
    this.emitCancel();
    this.IsError = null;
    this.errorMessage = null;
    this.submitAttempt = false;
    this.changeEmailForm = this.changeEmailFormInit();
  }

  emitCancel() {
    this.onCancel.emit();
  }
}
