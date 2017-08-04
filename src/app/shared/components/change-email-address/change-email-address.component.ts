import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateEmail, equalityCheck } from '../../../validators/validator';
import {UserService} from 'app/core/user.service';

@Component({
  selector: 'mygexa-change-email-address',
  templateUrl: './change-email-address.component.html',
  styleUrls: ['./change-email-address.component.scss']
})
export class ChangeEmailAddressComponent implements OnInit {
  IsResetSucessfull: boolean;
  changeEmailForm: FormGroup;
  submitAttempt = false;

  constructor(fb: FormBuilder, private user_service: UserService) {
  this.IsResetSucessfull = false;
     this.changeEmailForm = fb.group({
      'email': [null, Validators.compose([Validators.required, validateEmail])],
      'confirmEmail': [null, Validators.compose([Validators.required, validateEmail])]
   }, {validator: equalityCheck('email', 'confirmEmail')});
   }

  ngOnInit() {
  }

   submitForm(email: string, valid: boolean) {
    this.submitAttempt = true;

     if (valid) {
       this.user_service.updateEmailAddress(email).subscribe(
         result => { console.log('result', result);
           this.IsResetSucessfull = result; }
       );
     /** send form data to api to update in database */
     }

  }
  
       
  toggleEditEmailAddress($event) {
    $event.preventDefault();
  }

}
