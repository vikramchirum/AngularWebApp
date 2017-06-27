import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../core/user.service';
import {environment} from 'environments/environment';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {  validateEmail } from 'app/validators/validator';

@Component({
  selector: 'mygexa-recover-username',
  templateUrl: './recover-username.component.html',
  styleUrls: ['./recover-username.component.scss']
})
export class RecoverUsernameComponent implements OnInit {

  recoverUsernameForm: FormGroup; userExists: boolean;
  public IsValidEmail: boolean; formSubmitted: boolean = null;
  error: string = null;

  constructor(private user_service: UserService, private router: Router, private fb: FormBuilder, private _http: Http) {
    this.recoverUsernameForm = this.recoverUsernameFormInit();
    this.IsValidEmail = false;
  }

  recoverUsernameFormInit(): FormGroup {
    return this.fb.group({
        Email_Address: ['', validateEmail ]
      });
  }

  recoverUsername(email_address: string, isValid: boolean) {
    this.formSubmitted = true;
    if (isValid) {
      if (email_address && email_address.length) {
        this.user_service.recoverUsername(email_address).subscribe(
          result => {
            console.log(this.IsValidEmail)
            console.log(result)
            this.IsValidEmail = result;
          },
          error => {
            this.error = error.Message;
            this.IsValidEmail = false;
          });
      }
    }
  }
  ngOnInit() {
  }

}
