import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { get } from 'lodash';
import { UserService } from 'app/core/user.service';
import { ISecurityQuestions } from './register';
import { equalCheck, validateEmail, validateInteger } from 'app/validators/validator';
import { LoginRegisterModalComponent } from './login-register-modal/login-register-modal.component';
import { LoginAddClaimsModalComponent } from './login-add-claims-modal/login-add-claims-modal.component';
import { IUser } from '../../core/models/user/User.model';
import { IRegUser } from '../../core/models/register/register-user.model';
import { ChannelStore } from '../../core/store/channelstore';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  @ViewChild('loginRegisterModal') loginRegisterModal: LoginRegisterModalComponent;
  @ViewChild('loginAddClaimModal') public loginAddClaimModal: LoginAddClaimsModalComponent;

  invalidCreds: boolean;
  processing: boolean = null;
  registerForm: FormGroup = null;
  formSubmitted: boolean = null;
  user: IRegUser = null;
  user_name: string = null;
  error: string = null;
  password: string = null;
  userObj: IUser;

  constructor(
    private UserService: UserService,
    private Router: Router,
    private FormBuilder: FormBuilder,
    private channelStore: ChannelStore
  ) {
    this.processing = false;
    this.registerForm = this.registerFormInit();
    this.invalidCreds = false;
  }
  showRegisterModal() {
    // Call to get security questions fro registration.
    this.loginRegisterModal.getSecurityQuestions();
    this.loginRegisterModal.showLoginRegisterModal();
  }
  login() {
    this.processing = true;
    this.error = null;
    this.UserService.login(this.user_name, this.password).subscribe(
      (result) => {
        if ( get(result, 'Account_permissions.length', 0 ) <= 0 ) {
          ///this.processing = false;
          this.userObj = result;
          this.loginAddClaimModal.getUserCreds(result);
          this.loginAddClaimModal.showLoginAddClaimModal();
        } else {
          this.Router.navigate([this.UserService.UserState || '/']); }
        this.channelStore.LoadChannelId();
      },
      error => {
        // console.log('Error message', error.Message);
        this.error = String(error.Message);
        // console.log('Error', this.error);
        this.processing = false;
        this.invalidCreds = true;
      }
    );
  }

  save(model: IRegUser, isValid: boolean) {
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
      Service_Account_Id: ['', Validators.required],
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
  }
}
