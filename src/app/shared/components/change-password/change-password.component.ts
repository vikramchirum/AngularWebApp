import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { equalityCheck } from 'app/validators/validator';

@Component({
  selector: 'mygexa-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  changePasswordForm: FormGroup = null;
  submitAttempt: boolean = null;

  constructor(
    FormBuilder: FormBuilder
  ) {
    this.changePasswordForm = FormBuilder.group(
      {
        currentPassword: [null, Validators.required],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required]
      },
      {
        validator: equalityCheck('password', 'confirmPassword')
      }
    );
  }

  submitForm() {
    this.submitAttempt = true;
    console.log('value', this.changePasswordForm.value);
    console.log('valid', this.changePasswordForm.valid);
    if (this.changePasswordForm.valid) {
      /** send form data to api to update in database */
    }
  }

  emitCancel() {
    this.onCancel.emit();
  }

}
