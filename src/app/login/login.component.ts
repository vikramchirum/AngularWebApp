import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../core/user.service";
import {Router} from "@angular/router";
import {IUser, ISecurityQuestions} from "./register";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  processing: boolean;

 public user: IUser;
  user_name: string;
  error: string = null;
  password: string;
  public securityQues: ISecurityQuestions;

  constructor(private user_service: UserService, private router: Router) {
    this.processing = false;
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

  save(model: IUser, isValid: boolean) {
    // call API to save customer
    this.user_service.signup(model);
    console.log(model, isValid);
  }

  ngOnInit() {
    this.user = {
      Email_Address: '',
      Zip: '',
      Billing_Account_Id: '',
      User_name: '',
      Password: '',
      ConfirmPassword: ''
    };
  }
}
