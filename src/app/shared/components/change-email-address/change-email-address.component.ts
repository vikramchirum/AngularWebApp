import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateEmail, equalityCheck } from '../../../validators/validator'

@Component({
  selector: 'mygexa-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrls: ['./change-email-address.component.scss']
})
export class ChangeEmailAddressComponent implements OnInit {

  changeEmailForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(fb: FormBuilder) {
    
     this.changeEmailForm = fb.group({
      'email': [null, Validators.compose([Validators.required, validateEmail])],
      'confirmEmail': [null, Validators.compose([Validators.required, validateEmail])]
   }, {validator: equalityCheck('email', 'confirmEmail')});
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
