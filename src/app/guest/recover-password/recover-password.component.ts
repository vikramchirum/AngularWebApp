import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/user.service';
import {Router} from '@angular/router';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {environment} from 'environments/environment';

@Component({
  selector: 'mygexa-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})

export class RecoverPasswordComponent implements OnInit {
  resetPassForm: FormGroup;
  question: string;  error: string = null;
  IsUserNameValid: boolean;
  public IsSecurityQuestionValid: boolean;
  constructor(private user_service: UserService, private router: Router, private fb: FormBuilder, private _http: Http) {
    this.IsUserNameValid = this.IsSecurityQuestionValid = false;
    this.resetPassForm = this.resetPasswordFormInit();
  }
  resetPasswordFormInit(): FormGroup {
    return this.fb.group({
      'User_Name': [''],
      'SecQues_Answer': [''],
      'New_Password': [''],
      'Confirm_New_Password': ['']
    });
  }
  validateUsername(user_name: string) {
    if (user_name && user_name.length) {
      this.user_service.getSecQuesByUserName(user_name).subscribe(
        result => {
          this.question = result;
          console.log( 'Question', this.question);
          this.IsUserNameValid = true;
        },
        error => {
          this.error = error.Message;
          this.IsUserNameValid = false;
        });
    }
  }
  validateSecurityQuestion() {
    //this.IsUserNameValid = false;
    this.IsSecurityQuestionValid = true;
  }
  ngOnInit() {
  }

}
