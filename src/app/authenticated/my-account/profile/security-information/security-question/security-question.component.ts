import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { result } from 'lodash';
import { UserService } from 'app/core/user.service';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';
import { IUserSecurityQuestions } from 'app/core/models/user/User.model';

@Component({
  selector: 'mygexa-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent implements OnInit, OnDestroy {

  editing: boolean = null;
  securityQuestion: string = null;
  securityQuestions: IUserSecurityQuestions[] = [];
  username: string = null;
  securityQuestionForm: FormGroup = null;
  submitAttempt: boolean = null;
  errorOccured: boolean = null;
  errorMessage: string = null;
  UserServiceSubscription: Subscription = null;
  SecurityQuestionsSubscription: Subscription = null;

  constructor(
    private FormBuilder: FormBuilder,
    private UserService: UserService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
   this.securityQuestionForm = this.securityQuestionFormInit();
  }

  securityQuestionFormInit(): FormGroup {
    return this.FormBuilder.group({
      newQuestion: ['', Validators.required],
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
    this.SecurityQuestionsSubscription = this.UserService.getSecurityQuestions().subscribe(
      questions => {
        this.securityQuestions = questions;
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

  updateSecQuestionAndAnswer(Sec_Question: number, Sec_Answer: string, isValid: boolean) {
    this.submitAttempt = true;

    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UpdateSecurityQuestion]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UpdateSecurityQuestion]);

      if (isValid) {
        this.UserService.updateSecurityQuestion(Sec_Question, Sec_Answer).subscribe(
          res => {
            console.log( 'response', res);
            if (res === true) {
              this.resetForm();
              this.getSecurityQuestion(this.username);
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
    result(this.SecurityQuestionsSubscription, 'unsubscribe');
  }
}
