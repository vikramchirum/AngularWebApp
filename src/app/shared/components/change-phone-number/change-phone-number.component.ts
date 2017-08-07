import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { validatePhone, equalCheck } from 'app/validators/validator';

@Component({
  selector: 'mygexa-change-phone-number',
  templateUrl: './change-phone-number.component.html',
  styleUrls: ['./change-phone-number.component.scss']
})
export class ChangePhoneNumberComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  changePhoneNumberForm: FormGroup = null;
  submitAttempt: boolean = null;

  constructor(
    FormBuilder: FormBuilder
  ) {
    this.changePhoneNumberForm = FormBuilder.group(
      {
        phone: [null, Validators.compose([Validators.required, validatePhone])],
        confirmPhone: [null, Validators.compose([Validators.required, validatePhone])]
      },
      {
        validator: equalCheck('phone', 'confirmPhone')
      }
    );
  }

  submitForm() {
    this.submitAttempt = true;
    console.log('value', this.changePhoneNumberForm.value);
    console.log('valid', this.changePhoneNumberForm.valid);
    if (this.changePhoneNumberForm.valid) {
      /** send form data to api to update in database */
    }
  }

  emitCancel() {
    this.onCancel.emit();
  }
}
