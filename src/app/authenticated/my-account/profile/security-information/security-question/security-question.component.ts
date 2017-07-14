import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {UserService} from 'app/core/user.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent implements OnInit, OnDestroy {

  securityQuestion: string = null;
  username: string;
  securityQuestionForm: FormGroup;
  editing: boolean;
  submitAttempt: boolean;
  user_service_subscription: Subscription;

  constructor(fb: FormBuilder, private user_service: UserService) {
    this.editing = false;
    this.securityQuestionForm = fb.group({
      'question1': [null, Validators.required]
    }, { /* Validate security questions here. */ });
  }

  ngOnInit() {

    this.user_service_subscription = this.user_service.UserObservable.subscribe(
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
     this.user_service.getSecQuesByUserName(this.username).subscribe(
      res => { this.securityQuestion = res;
               localStorage.setItem('security_Question_Cache', res);
              // console.log('Security Question', res);
               return res; }
    );
  }

  toggleEdit($event) {
    $event.preventDefault();
    this.editing = !this.editing;
  }

  ngOnDestroy() {
    localStorage.removeItem('security_Question_Cache');
    this.user_service_subscription.unsubscribe();
  }
}
