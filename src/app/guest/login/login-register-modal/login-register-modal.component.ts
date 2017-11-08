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

  public getSecurityQuestions() {
    this.UserService.getSecurityQuestions()
      .subscribe(
        response => this.secQuesArray = response,
        error => this.error = <any>error
      );
  }

  ngOnInit() {
  }

  save(model: IRegUser, isValid: boolean) {
    this.resetValidationErrors();
    // call API to save customer
    if (isValid) {
      this.UserService.signup(model).subscribe(
        () => this.Router.navigate([this.UserService.UserState || '/']),
        error => {
          let errorMessage: string;
          errorMessage = error.Message;
          if (errorMessage.includes('The Service Account Search request is invalid.')) {
            this.registerForm.controls['Service_Account_Id'].setErrors({'incorrect': true});
            // this.errorMsg = 'We are having trouble finding this service account number. Please check the number, or call 866-961-9399 for assistance.';
          } else if (errorMessage.includes('User Exists')) {
            this.registerForm.controls['User_name'].setErrors({'userExists': true});
          } else if (errorMessage.includes('Username already created for CSP ID.')) {
            this.registerForm.controls['User_name'].setErrors({'userNameInUse': true});
          } else if (errorMessage.includes('We could not find the service account you supplied.')) {
            this.errorMsg = 'Information provided does not match our records. Please check the details, or call 866-961-9399 for assistance.';
          } else {
            this.errorMsg = errorMessage;
          }
          this.processing = false;
        }
      );
    } else {
      console.log('Invalid form');
      this.processing = false;
    }
  }

  resetValidationErrors() {
    this.processing = true;
    this.formSubmitted = true;
    this.errorMsg = null;
    // if ( this.registerForm.controls['Service_Account_Id'].value !== '' && !this.registerForm.controls['Service_Account_Id'].valid) {
    //   // this.registerForm.controls['Service_Account_Id'].setValue('', { onlySelf: true });
    //   //  this.registerForm.controls['Service_Account_Id'].setErrors({'incorrect': null});
    //   this.registerForm.controls['Service_Account_Id'].setErrors(null);
    // }
    // if ( this.registerForm.controls['User_name'].value !== '' && ! this.registerForm.controls['User_name'].valid ) {
    //   // this.registerForm.controls['User_name'].setValue('', { onlySelf: true });
    //   // this.registerForm.controls['User_name'].setErrors({'userExists': null});
    //   // this.registerForm.controls['User_name'].setErrors({'userNameInUse': null});
    //   this.registerForm.controls['User_name'].setErrors(null);
    // // }
  }

  reset() {
    this.processing = false;
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
      Password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(100), validatePassword])],
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
