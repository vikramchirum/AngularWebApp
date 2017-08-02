import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/user.service';
import {Router} from '@angular/router';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { equalCheck } from 'app/validators/validator';

@Component({
  selector: 'mygexa-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})

export class RecoverPasswordComponent implements OnInit {
  resetPassForm: FormGroup;
  IsResetSucessfull: boolean;
  public question: string;  error: string = null; public token: string;
  IsUserNameValid: boolean; IsResNull: boolean; IsResNull1: boolean;
  public IsSecurityQuestionValid: boolean;

  constructor(private user_service: UserService, private router: Router, private fb: FormBuilder, private _http: Http) {
    this.IsUserNameValid = this.IsSecurityQuestionValid = this.IsResetSucessfull = this.IsResNull = this.IsResNull1 = false ;
    this.resetPassForm = this.resetPasswordFormInit();
  }

  resetPasswordFormInit(): FormGroup {
    return this.fb.group({
      'User_Name': [''],
      'SecQues_Answer': [''],
      'New_Password': ['', Validators.required],
      'Confirm_New_Password': ['', Validators.required]
    }, {
      validator: equalCheck('New_Password', 'Confirm_New_Password')
    });
  }

  validateUsername(user_name: string) {
    if (user_name && user_name.length) {
      this.user_service.getSecQuesByUserName(user_name).subscribe(
        result => {
          if (result) {
            this.question = result;
            console.log( 'Question', this.question);
            this.IsUserNameValid = true;
          } else {
            this.IsResNull = true;
          }
        },
        error => {
          this.error = error.Message;
          this.IsUserNameValid = false;
        });
    }
  }

  validateSecurityQuestion(user_name: string, SecQues_Answer: string) {
    if ((user_name && user_name.length) && (SecQues_Answer && SecQues_Answer.length)) {
      this.user_service.checkSecQuesByUserName(user_name, SecQues_Answer).subscribe(
        result => {
          if (result) {
            this.token = result;
            this.IsSecurityQuestionValid = true;
          } else {
            this.IsResNull1 = true;
          }
        },
        error => {
          this.error = error.Message;
          this.IsSecurityQuestionValid = false;
        });
    }
  }

  resetPassword(user_name: string, New_Password: string) {
    if ((user_name && user_name.length) && (New_Password && New_Password.length)) {
      this.user_service.resetPassword(user_name, New_Password).subscribe(
        result => {
          this.IsResetSucessfull = result;
        },
      error => {
        this.error = error.Message;
      });
    }
  }

  ngOnInit() {
  }

}
