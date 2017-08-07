import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { validateEmail, equalityCheck } from 'app/validators/validator';
import { UserService } from 'app/core/user.service';

@Component({
  selector: 'mygexa-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrls: ['./change-email-address.component.scss']
})
export class ChangeEmailAddressComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  IsResetSuccessful: boolean = null;
  changeEmailForm: FormGroup = null;
  submitAttempt: boolean = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService
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

  submitForm() {
    this.submitAttempt = true;
    console.log('value', this.changeEmailForm.value);
    console.log('valid', this.changeEmailForm.valid);
    if (this.changeEmailForm.valid) {
      this.UserService.updateEmailAddress(this.changeEmailForm.get('email').value).subscribe(
        result => this.IsResetSuccessful = result
      );
     /** send form data to api to update in database */
    }
  }

  emitCancel() {
    this.onCancel.emit();
  }

}
