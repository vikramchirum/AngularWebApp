import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder , FormGroup, Validators} from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import {  validateEmail } from 'app/validators/validator';
import { UserService } from 'app/core/user.service';
import {LoginRegisterModalComponent} from '../login/login-register-modal/login-register-modal.component';

@Component({
  selector: 'mygexa-recover-username',
  templateUrl: './recover-username.component.html',
  styleUrls: ['./recover-username.component.scss']
})
export class RecoverUsernameComponent implements OnInit {

  @ViewChild('loginRegisterModal') loginRegisterModal: LoginRegisterModalComponent;
  recoverUsernameForm: FormGroup;
  userExists: boolean;
  public IsValidEmail: boolean;
  processing: boolean = null;
  formSubmitted: boolean = null;
  error: string = null;
  RecoveredUsername: string = null;

  constructor(private user_service: UserService, private router: Router, private fb: FormBuilder, private _http: Http) {
    this.recoverUsernameForm = this.recoverUsernameFormInit();
  }

  recoverUsernameFormInit(): FormGroup {
    return this.fb.group({
      Email_Address: ['', validateEmail]
    });
  }

  recoverUsername(email_address: string, isValid: boolean) {
    this.formSubmitted = true;
    if (isValid) {
    this.processing = true;
      if (email_address && email_address.length) {
        this.user_service.recoverUsername(email_address).subscribe(
          result => {
            this.IsValidEmail = result;
            this.RecoveredUsername = sessionStorage.getItem('User_Name');
            console.log('IsValidEmail', this.IsValidEmail);
            console.log('Username', result);
            this.processing = false;


          },
          error => {
            this.error = error.Message;
            this.IsValidEmail = false;
            this.processing = false;

          });
      }
    }
  }

  ngOnInit() {
  }

  showRegisterModal() {
    // Call to get security questions fro registration.
    this.loginRegisterModal.getSecurityQuestions();
    this.loginRegisterModal.showLoginRegisterModal();
  }
}
