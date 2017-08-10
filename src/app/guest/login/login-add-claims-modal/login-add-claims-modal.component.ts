import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { equalCheck, validateEmail, validateInteger } from 'app/validators/validator';
import {HttpClient} from '../../../core/httpclient';
import {Router} from '@angular/router';
import {UserService} from '../../../core/user.service';
import {IUser} from '../../../core/models/user/User.model';
import {IClaim} from '../../../core/models/user/User-claim.model';

@Component({
  selector: 'mygexa-login-add-claims-modal',
  templateUrl: './login-add-claims-modal.component.html',
  styleUrls: ['./login-add-claims-modal.component.scss']
})
export class LoginAddClaimsModalComponent implements OnInit {
  @ViewChild('loginAddClaimModal') public loginAddClaimModal: ModalDirective;

  public user: IUser = null;

  processing: boolean = null;
  addClaimForm: FormGroup = null;
  formSubmitted: boolean = null;
  errorMsg: string = null;
  token: string = null;
  constructor(
    private UserService: UserService,
    private Router: Router,
    private FormBuilder: FormBuilder,
    private _http: HttpClient
  ) {
    this.processing = false; this.errorMsg = null;
    this.addClaimForm = this.addClaimFormInit();
  }

  ngOnInit() {
  }
  addClaimFormInit(): FormGroup {
    return this.FormBuilder.group({
      Service_Account_Id: ['', Validators.required],
      Zip_Code: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5), validateInteger])]
    });
  }
  public showLoginAddClaimModal(): void {
    this.loginAddClaimModal.show();
  }

  public hideLoginAddClaimModal(): void {
    this.loginAddClaimModal.hide();
  }
  reset() {
    this.formSubmitted = false;
    this.errorMsg = null;
    this.addClaimForm = this.addClaimFormInit();
    this.hideLoginAddClaimModal();
    this.Router.navigate(['/login']);
  }

  public getUserCreds(usr: IUser) {
    this.user = usr;
    console.log('User from login', this.user);
  }

  addClaimAndLogin(model: IClaim, isValid: boolean) {
    this.formSubmitted = true;
    if (isValid) {
      this.token = this.user.Token;
      console.log('Token', this.token, model.Zip_Code, model.Service_Account_Id);
      this.UserService.updateClaim(this.token, model.Zip_Code, model.Service_Account_Id).subscribe(
        result => { if (result) {
          this.UserService.ApplyUserData(result);
          location.reload();
        } else {
          this.Router.navigate(['/login']);
        }
        },
        error => {
          this.errorMsg = error.Message;
          this.processing = false;
        }
      );
    }
  }
}
