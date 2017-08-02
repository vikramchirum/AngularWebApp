import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'app/core/user.service';
import { ISecurityQuestions, IUser } from 'app/guest/login/register';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: IUser;
  public securityQues: ISecurityQuestions;
  myForm: FormGroup;

  constructor(private user_service: UserService, private router: Router) {
  }

  ngOnInit() {
    // this.user = {
    //   Email_Address: '',
    //   Zip: '',
    //   Service_Account_Id: '',
    //   User_name: '',
    //   Password: '',
    //   ConfirmPassword:''
    // };
  }

  save(model: IUser, isValid: boolean) {
    // call API to save customer
    this.user_service.signup(model);
    console.log(model, isValid);
  }

}
