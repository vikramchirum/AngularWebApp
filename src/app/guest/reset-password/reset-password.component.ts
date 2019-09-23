import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserService } from 'app/core/user.service';
import { equalCheck, validatePassword } from 'app/validators/validator';
import { LoginRegisterModalComponent } from 'app/guest/login/login-register-modal/login-register-modal.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'mygexa-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  queryParamsSubscription: Subscription = null;
  resetPassForm: FormGroup;
  IsResetSucessfull: boolean;
  processing: boolean = null;
  error: string = null; public resetToken: string; public userName: string;
  public can_reset_password: boolean;

  constructor(private user_service: UserService
              , private Route: ActivatedRoute
              , private router: Router, private fb: FormBuilder, private _http: Http) {
    this.can_reset_password = true;
    this.resetPassForm = this.resetPasswordFormInit();
    this.queryParamsSubscription = this.Route.queryParams.subscribe(params => {
      this.resetToken = params['Reset_Token'] || null;
      this.userName = params['User_Name'] || null;
      if (!this.resetToken || !this.userName) {
        this.can_reset_password = false;
      }
    });
  }

  resetPasswordFormInit(): FormGroup {
    return this.fb.group({
      'New_Password': ['',  Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(100), validatePassword])],
      'Confirm_New_Password': ['', Validators.required]
    }, {
      validator: equalCheck('New_Password', 'Confirm_New_Password')
    });
  }

  resetPassword(New_Password: string) {
    this.processing = true;
    this.error = null;
    if ((this.userName) && (New_Password)) {
      this.user_service.resetPassword(this.userName, New_Password, this.resetToken).subscribe(
        result => {
          if (!result) {
            this.error = 'There is an error in resetting the password. Please try later.';
          }
          this.IsResetSucessfull = result;
          this.processing = false;
        },
        error => {
          this.error = error.Message;
          this.processing = false;
        });
    }
  }
  ngOnInit() {
  }
}
