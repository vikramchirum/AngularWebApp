import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { equalityCheck } from 'app/validators/validator';
import {UserService} from '../../../core/user.service';

@Component({
  selector: 'mygexa-change-user-name',
  templateUrl: './change-user-name.component.html',
  styleUrls: ['./change-user-name.component.scss']
})
export class ChangeUserNameComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  IsUpdateSuccessful: boolean = null;
  IsError: boolean = null;
  errorMessage: string = null;
  changeUserNameForm: FormGroup = null;
  submitAttempt: boolean = null;
   constructor(
     private FormBuilder: FormBuilder,
     private UserService: UserService
   ) {
     this.changeUserNameForm = this.changeUserNameFormInit();
   }

  changeUserNameFormInit(): FormGroup {
     return this.FormBuilder.group({
       userName: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(100)])],
       confirmUserName: [null, Validators.required]},
       {
         validator: equalityCheck('userName', 'confirmUserName')
       });
  }
   submitForm() {
     this.submitAttempt = true;
     console.log('value', this.changeUserNameForm.value);
     console.log('valid', this.changeUserNameForm.valid);
     if (this.changeUserNameForm.valid) {
       this.UserService.updateUserName(this.changeUserNameForm.get('userName').value).subscribe(
         res => { if (res === true) { this.IsUpdateSuccessful = res; } else {
           this.errorMessage = res; this.IsError = true;
         }}
       );
     }
   }

  resetForm() {
    this.IsError = null;
    this.errorMessage = null;
    this.submitAttempt = false;
    this.changeUserNameForm = this.changeUserNameFormInit();
  }

   emitCancel() {
     this.onCancel.emit();
   }

}
