import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { result } from 'lodash';
import { UserService } from 'app/core/user.service';

@Component({
  selector: 'mygexa-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent implements OnInit, OnDestroy {

  editing: boolean = null;
  securityQuestion: string = null;
  username: string = null;
  securityQuestionForm: FormGroup = null;
  submitAttempt: boolean = null;
  errorOccured: boolean = null;
  errorMessage: string = null;
  UserServiceSubscription: Subscription = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService
  ) {
   this.securityQuestionForm = this.securityQuestionFormInit();
  }

  securityQuestionFormInit(): FormGroup {
    return this.FormBuilder.group({
      question1: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => {
        this.username = result.Profile.Username;
        if (localStorage.getItem('security_Question_Cache') != null) {
          this.securityQuestion = localStorage.getItem('security_Question_Cache');
        } else {
          this.getSecurityQuestion(this.username);
        }
      }
    );
  }

  getSecurityQuestion(username: string) {
     this.UserService.getSecQuesByUserName(username).subscribe(
      res => {
        this.securityQuestion = res;
        localStorage.setItem('security_Question_Cache', res);
        // console.log('Security Question', res);
      }
    );
  }
  updateSecQuesResponse(Sec_Answer: string, isValid: boolean ) {
    this.submitAttempt = true;
    if (isValid) {
      this.UserService.updateSecurityAnswer(Sec_Answer).subscribe(
        res => {
          console.log( 'response', res);
          if (res === true) {
            this.resetForm();
          } else {
            this.errorOccured = true;
            this.errorMessage = res;
          }
        },
        error => { console.log('Error', error); }
      );
    }
  }
  resetForm() {
    this.errorOccured = null;
    this.errorMessage = null;
   this.submitAttempt = false;
   this.securityQuestionForm = this.securityQuestionFormInit();
   this.editing = false;
  }
  ngOnDestroy() {
    localStorage.removeItem('security_Question_Cache');
    result(this.UserServiceSubscription, 'unsubscribe');
  }
}
