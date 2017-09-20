import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {equalityCheck, validatePassword} from 'app/validators/validator';
import {UserService} from '../../../core/user.service';

@Component({
  selector: 'mygexa-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  changePasswordForm: FormGroup = null;
  submitAttempt: boolean = null;
  errorMessage: string = null;
  IsError: boolean = null;
  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService
  ) {
    this.changePasswordForm = this.changePasswordFormInit();
  }
  changePasswordFormInit(): FormGroup {
    return this.FormBuilder.group(
      {
        // currentPassword: [null, Validators.required],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(100), validatePassword])],
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
      this.UserService.updateUserPassword(this.changePasswordForm.get('password').value).subscribe(
        res => {
          if (res) {
            this.resetForm();
             console.log('Password reset successfully');
             } else {
            this.errorMessage = res; this.IsError = true;
          }}
      );
    }
  }

  resetForm() {
    // console.log('Reset form');
    this.emitCancel();
    this.IsError = null;
    this.errorMessage = null;
    this.submitAttempt = false;
    this.changePasswordForm = this.changePasswordFormInit();
  }

  emitCancel() {
    this.onCancel.emit();
  }

}
