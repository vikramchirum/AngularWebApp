import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { equalityCheck } from '../../../validators/validator'

@Component({
  selector: 'mygexa-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

 changePasswordForm: FormGroup;
  submitAttempt: boolean = false;
   constructor(fb: FormBuilder) {
    
     this.changePasswordForm = fb.group({
      'currentPassword': [null, Validators.required],
      'password': [null, Validators.required],
      'confirmPassword': [null, Validators.required]
    }, { validator: equalityCheck('password', 'confirmPassword') });
   }
  ngOnInit() {
  }

}
