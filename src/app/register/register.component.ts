import { Directive, Component, OnInit } from '@angular/core';
import { UserService } from "../shared/user.service";
import { Router } from "@angular/router";
import { IToken } from "app/login/login.component.token";
import {IUser} from "app/register/register";

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

public user: IUser;
constructor(private user_service: UserService, private router: Router) { }

  ngOnInit() {

  this.user = {
    zip_code : '12345',
    email_address : 'a@gmail.com ',
    customer_account_id : '1122334455',
    user_name: 'test',
    password : 'test',
    confirm_password : 'test'
  };

  }

  save(model: IUser, isValid: boolean) {
    // call API to save customer
    this.user_service.signup(model);
    console.log(model, isValid);
  }

}
