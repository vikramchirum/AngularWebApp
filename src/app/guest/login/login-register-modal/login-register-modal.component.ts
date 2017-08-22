import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISecurityQuestions} from '../register';
import {UserService} from '../../../core/user.service';
import {Router} from '@angular/router';
import { equalCheck, validateEmail, validateInteger, validatePassword } from 'app/validators/validator';
import {HttpClient} from '../../../core/httpclient';
import {IRegUser} from '../../../core/models/register/register-user.model';

@Component({
  selector: 'mygexa-login-register-modal',
  templateUrl: './login-register-modal.component.html',
  styleUrls: ['./login-register-modal.component.scss']
})
export class LoginRegisterModalComponent implements OnInit {
  @ViewChild('loginRegisterModal') public loginRegisterModal: ModalDirective;
  processing: boolean = null;
  registerForm: FormGroup = null;
  formSubmitted: boolean = null;
  user: IRegUser = null;
  error: string = null;
  errorMsg: string = null;
  secQuesArray: ISecurityQuestions[] = [];

  constructor(
    private UserService: UserService,
    private Router: Router,
    private FormBuilder: FormBuilder,
    private _http: HttpClient
  ) {
    this.processing = false; this.errorMsg = null;
    this.registerForm = this.registerFormInit();
  }

  ngOnInit() {
    this.UserService.getSecurityQuestions()
      .subscribe(
        response => this.secQuesArray = response,
        error => this.error = <any>error
      );
  }

  save(model: IRegUser, isValid: boolean) {
    this.formSubmitted = true;
    // call API to save customer
    if (isValid) {
      this.UserService.signup(model).subscribe(
        () => this.Router.navigate([this.UserService.UserState || '/']),
        error => {
          if (error.includes('Internal')) {
            console.log('Hi');
          } else {
            this.errorMsg = error.toString();
            this.processing = false;
          }
        }
      );
    }
  }
  reset() {
    this.formSubmitted = false;
    this.errorMsg = null;
    this.registerForm = this.registerFormInit();
    this.hideLoginRegisterModal();
  }
  registerFormInit(): FormGroup {
    return this.FormBuilder.group({
      Service_Account_Id: ['', Validators.required],
      Zip_Code: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5), validateInteger])],
      User_name: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(100)])],
      Password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10), validatePassword])],
      ConfirmPassword: ['', Validators.required],
      Email_Address: ['', Validators.compose([Validators.required, validateEmail])],
      Security_Question_Id: ['', Validators.required],
      Security_Question_Answer: ['', Validators.required]
    }, {
      validator: equalCheck('Password', 'ConfirmPassword')
    });
  }
  public showLoginRegisterModal(): void {
    this.loginRegisterModal.show();
  }

  public hideLoginRegisterModal(): void {
    this.loginRegisterModal.hide();
  }

}
