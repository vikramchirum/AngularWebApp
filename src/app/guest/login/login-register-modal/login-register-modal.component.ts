import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Form , FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ISecurityQuestions } from '../register';
import { UserService } from '../../../core/user.service';
import { Router } from '@angular/router';
import { equalCheck, validateEmail, validateInteger, validatePassword } from 'app/validators/validator';
import { HttpClient } from '../../../core/httpclient';
import { IRegUser } from '../../../core/models/register/register-user.model';
import { CustomerAccountStore } from '../../../core/store/CustomerAccountStore';
import { CustomerAccount } from '../../../core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-login-register-modal',
  templateUrl: './login-register-modal.component.html',
  styleUrls: ['./login-register-modal.component.scss']
})
export class LoginRegisterModalComponent implements OnInit {
  @ViewChild('loginRegisterModal') public loginRegisterModal: ModalDirective;
  Last_4: string = null;
  DDL: string = null;
  State: string = null;
  Id: string = null;
  processing: boolean = null;
  registerClicked: boolean = null;
  registerForm: FormGroup = null;
  formSubmitted: boolean = null;
  showServiceNumberHelp: boolean = null;
  showServiceNumberEBill: boolean = null;
  user: IRegUser = null;
  error: string = null;
  errorMsg: string = null;
  errorMsgLastStep: string = null;
  statesArray: string[] = [];
  secQuesArray: ISecurityQuestions[] = [];
  currentView: string = null;
  customerDetails: CustomerAccount = null;
  processRegistration: boolean = null;
  constructor(
    private UserService: UserService,
    private Router: Router,
    private FormBuilder: FormBuilder,
    private CustomerAccountStore: CustomerAccountStore,
    private _http: HttpClient
  ) {
    this.processing = this.registerClicked = false; this.errorMsg = null;
    this.registerForm = this.registerFormInit();
  }

  public getSecurityQuestions() {
    this.UserService.getSecurityQuestions()
      .subscribe(
        response => this.secQuesArray = response,
        error => this.error = <any>error
      );
    this.UserService.getStatesAbb().subscribe(
      response => this.statesArray = response,
      error => this.error = <any>error
    );
  }

  ngOnInit() {
    this.currentView = 'ssn';
  }

  verifyForm(model: IRegUser) {
    this.processRegistration = true;
    if (this.currentView === 'ssn') {
      if (this.Last_4 && this.Last_4 === String(this.customerDetails.Masked_Social_Security_Number).slice(-4)) {
        this.resgister(model);
      }  else {
        this.processRegistration = false;
        let error = "SSN provided doesn't match our records.";
        this.errorMsgLastStep = error;
      }
    } else if (this.currentView === 'ddl/id') {
      if (this.Id && this.Id === this.customerDetails.AlternateID.Number) {
        this.resgister(model);
      } else if (this.DDL && (this.DDL === this.customerDetails.Drivers_License.Number) && this.State === this.customerDetails.Drivers_License.State) {
        this.resgister(model);
      } else {
         this.processRegistration = false;
         let error = "ID provided doesn't match our records.";
         this.errorMsgLastStep = error;
       }
    } else {
      this.processRegistration = false;
      this.currentView = null;
    }
  }

  resgister(model: IRegUser) {
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
  }

  save(model: IRegUser, isValid: boolean) {
    this.resetValidationErrors();
    // call API to save customer
    if (isValid) {
      this.UserService.verifyRegisterUser(model).subscribe(
        (result1) => {
          console.log('hello', result1);
          if (result1 === 'User Verified') {
            this.registerClicked = true;
            this.UserService.getCustomerInfo(model).subscribe(
              result => {
                if (result) {
                  this.customerDetails = result;
                  if (this.customerDetails.Masked_Social_Security_Number) {
                    this.currentView = 'ssn';
                  } else if (this.customerDetails.AlternateID || this.customerDetails.Drivers_License.Number) {
                    this.currentView = 'ddl/id';
                  }
                } else {
                  this.errorMsg = 'User verification failed';
                }
              }
            );
          } else {
            this.errorMsg = 'User verification failed';
          }
        } ,
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
      // console.log('Invalid form');
      this.processing = false;
      this.registerClicked = false;
    }
  }

  resetValidationErrors() {
    this.processing = true;
    this.formSubmitted = true;
    this.errorMsg = null;
  }

  reset() {
    this.processing = false;
    this.registerClicked = false;
    this.formSubmitted = false;
    this.errorMsg = this.errorMsgLastStep = null;
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
    
  ServiceNumberHelpToggle() {
    this.showServiceNumberHelp = !this.showServiceNumberHelp;
  }
  
  ServiceNumberEBillToggle(state) {
    
    this.showServiceNumberEBill = state;
  }
  
}
