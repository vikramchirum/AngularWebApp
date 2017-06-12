import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../core/user.service";
import {Router} from "@angular/router";
import {IUser, ISecurityQuestions} from "./register";
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {validateEmail, equalityCheck} from "app/validators/validator";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  processing: boolean;
  registerForm: FormGroup;
  formSubmitted: boolean = false;
   public user: IUser;
  user_name: string;
  error: string = null;
  password: string;
  public securityQues: ISecurityQuestions;

  constructor(private user_service: UserService, private router: Router, private fb: FormBuilder) {
    this.processing = false;
    this.registerForm = fb.group({
      'Billing_Account_Id': ['', Validators.compose([Validators.required])],
      'Zip': ['', Validators.compose([Validators.required])],
      'User_name': ['', Validators.compose([Validators.required])],
      'Password': ['', Validators.compose([Validators.required])],
      'ConfirmPassword': ['', Validators.compose([Validators.required])],
      'Email_Address': ['', Validators.compose([Validators.required, validateEmail])],
      'Security_Question_Id': ['', Validators.compose([Validators.required])]
    });
    // , {validator: equalityCheck('email', 'confirmEmail')});
  }


  login() {
    this.processing = true;
    this.error = null;
    this.user_service.login(this.user_name, this.password)
      .subscribe(
        token => {
          this.router.navigate(this.user_service.state ? [this.user_service.state] : ['/account/profile']);
        },
        error => {
          this.error = error.Message;
          this.processing = false;
        });

  }

  save(model: any, isValid: boolean) {
    this.formSubmitted = true;
    // call API to save customer
    if (isValid) {
      //this.user_service.signup(model);
    }
    // console.log("Isvalid",isValid);
   // this.registerForm.reset();
  }

  ngOnInit() {

  }
}
