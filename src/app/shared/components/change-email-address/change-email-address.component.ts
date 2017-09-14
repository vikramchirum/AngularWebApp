import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { validateEmail, equalityCheck } from 'app/validators/validator';
import { UserService } from 'app/core/user.service';
import {CustomerAccount} from '../../../core/models/customeraccount/customeraccount.model';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccountService} from '../../../core/CustomerAccount.service';
import {CustomerAccountStore} from '../../../core/store/CustomerAccountStore';
import {IUser} from '../../../core/models/user/User.model';

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
  CustomerAccountServiceStoreSubscription: Subscription = null;
  updateUser: IUser = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService,
    private CustomerAccountService: CustomerAccountService,
    private CustomerAccountStore: CustomerAccountStore
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
    console.log('value', this.changeEmailForm.value);
    console.log('valid', this.changeEmailForm.valid);
    if (this.changeEmailForm.valid) {
      this.UserService.updateEmailAddress(this.changeEmailForm.get('email').value).subscribe(
        result => { this.IsResetSuccessful = result;
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
          this.errorMessage = result; this.IsError = true;
        }});
     /** send form data to api to update in database */
    }
  }

  resetForm() {
    // console.log('Reset form');
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
