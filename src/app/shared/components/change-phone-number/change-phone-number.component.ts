import { Component, OnInit } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validatePhone, equalCheck } from '../../../validators/validator'

@Component({
  selector: 'mygexa-change-phone-number',
  templateUrl: './change-phone-number.component.html',
  styleUrls: ['./change-phone-number.component.scss']
})
export class ChangePhoneNumberComponent implements OnInit {

  changePhoneNumberForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(fb: FormBuilder) {
    
     this.changePhoneNumberForm = fb.group({
      'phone': [null, Validators.compose([Validators.required, validatePhone])],
      'confirmPhone': [null, Validators.compose([Validators.required, validatePhone])]
   }, {validator: equalCheck('phone', 'confirmPhone')});
   }

  ngOnInit() {
  }
  
   submitForm(value: any, valid:boolean) {
    this.submitAttempt = true;
     if(valid){
     /** send form data to api to update in database */
     }  

  }

}
