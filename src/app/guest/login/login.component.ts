import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { UserService } from 'app/core/user.service';
import { IUser, ISecurityQuestions } from './register';
import { equalCheck, validateEmail, validateInteger } from 'app/validators/validator';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  processing: boolean = null;
  registerForm: FormGroup = null;
  formSubmitted: boolean = null;
  user: IUser = null;
  user_name: string = null;
  error: string = null;
  password: string = null;
  secQuesArray: ISecurityQuestions[] = [];

  constructor(
    private UserService: UserService,
    private Router: Router,
    private FormBuilder: FormBuilder
  ) {
    this.processing = false;
    this.registerForm = this.registerFormInit();

  }

  login() {
    this.processing = true;
    this.error = null;
    this.UserService.login(this.user_name, this.password).subscribe(
      () => this.Router.navigate([this.UserService.UserState || '/']),
      error => {
        this.error = error.Message;
        this.processing = false;
      }
    );
  }

  save(model: IUser, isValid: boolean) {
    this.formSubmitted = true;
    // call API to save customer
    if (isValid) {
      this.UserService.signup(model).subscribe(
        () => this.Router.navigate([this.UserService.UserState || '/']),
        error => {
          this.error = error.Message;
          this.processing = false;
        }
      );
    }
  }
  reset() {
    this.formSubmitted = false;
    this.registerForm = this.registerFormInit();
  }

  registerFormInit(): FormGroup {
    return this.FormBuilder.group({
      Billing_Account_Id: ['', Validators.required],
      Zip_Code: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5), validateInteger])],
      User_name: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      Email_Address: ['', Validators.compose([Validators.required, validateEmail])],
      Security_Question_Id: ['none', Validators.required],
      Security_Question_Answer: ['', Validators.required]
    }, {
      validator: equalCheck('Password', 'ConfirmPassword')
    });
  }

  ngOnInit(): void {

    // Mute the video if the "muted" video tag does not (a supposed FireFox bug.)
    document.getElementById('login-video-player')['muted'] = 'muted';

    this.UserService.getSecurityQuestions()
      .subscribe(
        response => this.secQuesArray = response,
        error => this.error = <any>error
      );
  }
}
