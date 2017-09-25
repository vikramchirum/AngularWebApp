import { Component, EventEmitter, Output } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

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
  IsMobileSelected: boolean = null;
  AllowSave: boolean = null;
  checkboxChecked: boolean = null;
  constructor(
    FormBuilder: FormBuilder
  ) {
    this.changePhoneNumberForm = FormBuilder.group(
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
    console.log('value', this.changePhoneNumberForm.value);
    console.log('valid', this.changePhoneNumberForm.valid);
    if (this.changePhoneNumberForm.valid) {
      /** send form data to api to update in database */
    }
  }

  radioButtonSelected(c: string) {
    // const c = this.changePhoneNumberForm.get('mobileRadio').value;
    if (c === 'mobile') {
      this.IsMobileSelected = true;
      this.AllowSave = this.checkboxChecked ? false : true;
    } else {
      this.IsMobileSelected = false;
      this.AllowSave = false;
    }
  }

  mobileCheckBoxChecked(event) {
    if (event.target.checked && this.IsMobileSelected) {
      this.checkboxChecked = true;
      this.AllowSave =  false;
    } else {
      this.checkboxChecked = false;
      this.AllowSave =  true;
    }
  }

  emitCancel() {
    this.onCancel.emit();
  }
}
