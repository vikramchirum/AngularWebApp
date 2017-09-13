import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { equalityCheck } from 'app/validators/validator';
import {UserService} from '../../../core/user.service';
import {IUser} from '../../../core/models/user/User.model';

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
  updateUser: IUser;
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
         res => {  // console.log('Reset successful');
           if (res) {
           // console.log('Reset initiated');
            this.updateUser = this.UserService.UserCache;
            this.updateUser.Profile.Username = this.changeUserNameForm.get('userName').value;
            this.UserService.updateUserInMongo(this.updateUser);
           this.IsUpdateSuccessful = res; this.resetForm(); } else {
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
    this.changeUserNameForm = this.changeUserNameFormInit();
  }

   emitCancel() {
     this.onCancel.emit();
   }

}
