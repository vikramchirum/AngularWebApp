import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { validateEmail, equalityCheck } from 'app/validators/validator';
import { UserService } from 'app/core/user.service';
import {CustomerAccount} from '../../../core/models/customeraccount/customeraccount.model';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccountService} from '../../../core/CustomerAccount.service';
import {CustomerAccountStore} from '../../../core/store/CustomerAccountStore';

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
  Exiting_CustomerDetails: CustomerAccount = null;
  CustomerAccountServiceSubscription: Subscription = null;
  CustomerAccountServiceStoreSubscription: Subscription = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService,
    private CustomerAccountService: CustomerAccountService,
    private CustomerAccountStore: CustomerAccountStore
  ) {
    this.IsResetSuccessful = false;
    this.changeEmailForm = FormBuilder.group(
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
        } else {
          // show error message
        }});
     /** send form data to api to update in database */
    }
  }

  emitCancel() {
    this.onCancel.emit();
  }

}
