import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { validatePhone, equalCheck } from 'app/validators/validator';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { CustomerAccountStore } from 'app/core/store/CustomerAccountStore';
import { Subscription } from 'rxjs/Subscription';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { IUser } from 'app/core/models/user/User.model';
import { UserService } from 'app/core/user.service';
import { PhoneNumberConfirmationModalComponent } from '../phone-number-confirmation-modal/phone-number-confirmation-modal.component';

import {GoogleAnalyticsService} from 'app/core/googleanalytics.service';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';

@Component({
  selector: 'mygexa-change-phone-number',
  templateUrl: './change-phone-number.component.html',
  styleUrls: ['./change-phone-number.component.scss']
})
export class ChangePhoneNumberComponent implements OnInit {
  @ViewChild('phonePopModal') public phonePopModal: PhoneNumberConfirmationModalComponent;
  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  changePhoneNumberForm: FormGroup = null;
  submitAttempt: boolean = null;
  IsMobileSelected: boolean = null;
  IsLandlineSelected: boolean = null;
  AllowSave: boolean = null;
  checkboxChecked: boolean = null;
  IsNoSelected: boolean = null;
  errorMessage: string = null;
  IsError: boolean = null;
  updateUser: IUser = null;

  Exiting_CustomerDetails: CustomerAccount = null;
  CustomerAccountServiceSubscription: Subscription = null;
  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService,
    private CustomerAccountService: CustomerAccountService,
    private CustomerAccountStore: CustomerAccountStore,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.changePhoneNumberForm = this.changePhoneNumberFormInit();
  }

  ngOnInit() {
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => { this.Exiting_CustomerDetails = result; }
    );
  }

  changePhoneNumberFormInit(): FormGroup {
    return this.changePhoneNumberForm = this.FormBuilder.group(
      {
        phone: [null, Validators.compose([Validators.required, validatePhone])],
        confirmPhone: [null, Validators.compose([Validators.required, validatePhone])],
        mobileRadio: [null],
        landlineRadio: [null],
        mobileCheckbox: [null]
      },
      {
        validator: equalCheck('phone', 'confirmPhone')
      }
    );
  }

  submitForm() {

    this.submitAttempt = true;
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UpdatePhoneNumber]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UpdatePhoneNumber]);

    if (this.changePhoneNumberForm.valid) {
      /** send form data to api to update in database */
      if (this.IsMobileSelected && (this.checkboxChecked === null || this.checkboxChecked === false )) {
        this.phonePopModal.showPhoneConfirmationModal(); } else if (this.IsLandlineSelected) {
        this.updatePhoneNumber();
      } else if (this.IsMobileSelected && this.checkboxChecked === true ) {
        this.updatePhoneNumber();
      } else {
        this.IsNoSelected = true;
      }
    }
  }

  updatePhoneNumber() {
    let phonenum: string;
    phonenum = this.changePhoneNumberForm.get('phone').value;
      // Format primary phone object for put
      const number = phonenum.replace( /\D+/g, '');
      const area_code = number.substring(0, 3);
      const phonenumber = number.slice(3);

      // Format existing user object
      this.Exiting_CustomerDetails.Primary_Phone.Area_Code = area_code;
      this.Exiting_CustomerDetails.Primary_Phone.Number = phonenumber;
      this.Exiting_CustomerDetails.Primary_Phone.Type = this.IsMobileSelected ? 'Mobile' : 'Landline';
      this.Exiting_CustomerDetails.Primary_Phone.Agree_To_Marketing = this.checkboxChecked ? 'true' : 'false';

      if (this.Exiting_CustomerDetails.Primary_Phone.Type === 'Landline') {
        this.Exiting_CustomerDetails.Primary_Phone.Agree_To_Marketing = 'true';
      }

      // Update user details in weasi
      this.CustomerAccountStore.UpdateCustomerDetails(this.Exiting_CustomerDetails);
      this.updateUser = this.UserService.UserCache;

      // Refresh User in Mongo
      this.UserService.updateUserInMongo(this.updateUser);
      this.resetForm();
      this.Exiting_CustomerDetails.Primary_Phone.Type = this.changePhoneNumberForm.get('phone').value;
  }

  onNotify(event) {
    this.AllowSave = event;
    if (this.AllowSave) {
      this.phonePopModal.hidePhoneConfirmationModal();
      this.updatePhoneNumber();
    }
  }

  radioButtonSelected(c: string) {
    // const c = this.changePhoneNumberForm.get('mobileRadio').value;
    if (c === 'mobile') {
      this.IsMobileSelected = true;
      this.IsLandlineSelected = false;
    } else if (c === 'landline') {
      this.IsMobileSelected = false;
      this.IsLandlineSelected = true;
    }
  }

  mobileCheckBoxChecked(event) {
    if (event.target.checked && this.IsMobileSelected) {
      this.checkboxChecked = true;
      // this.AllowSave =  false;
    } else {
      this.checkboxChecked = false;
      // this.AllowSave =  true;
    }
  }

  resetForm() {
    // console.log('Reset form');
    this.emitCancel();
    this.IsError = this.checkboxChecked = this.IsMobileSelected = this.IsLandlineSelected = this.IsNoSelected = null;
    this.errorMessage = null;
    this.submitAttempt = false;
    this.changePhoneNumberForm = this.changePhoneNumberFormInit();
  }

  emitCancel() {
    this.onCancel.emit();
  }
}
