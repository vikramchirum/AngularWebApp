import {Directive, Component, OnInit} from '@angular/core';
import {UserService} from "../shared/user.service";
import {Router} from "@angular/router";
import {IToken} from "app/login/login.component.token";
import {ISecurityQuestions, IUser} from "app/register/register";

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: IUser;
  public securityQues: ISecurityQuestions;

  constructor(private user_service: UserService, private router: Router) {
  }

  ngOnInit() {
    this.user = {
      Email_Address: '',
      Zip: '',
      Billing_Account_Id: '',
      User_name: '',
      Password: ''
    };
  }

  save(model: IUser, isValid: boolean) {
    // call API to save customer
    this.user_service.signup(model);
    console.log(model, isValid);
  }

}
