import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { equalityCheck } from '../../../../validators/validator';
import {UserService} from 'app/core/user.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-security-information',
  templateUrl: './security-information.component.html',
  styleUrls: ['./security-information.component.scss']
})
export class SecurityInformationComponent implements OnInit, OnDestroy {

  userName: string;
  userNameEditing: boolean;
  passwordEditing: boolean;
  editing: boolean;
  user_service_subscription: Subscription;

  submitAttempt: boolean;
  constructor(fb: FormBuilder, private user_service: UserService) {
    this.submitAttempt = false;
    this.userNameEditing = false;
    this.passwordEditing = false;
  }

  ngOnInit() {

    this.user_service_subscription = this.user_service.UserObservable.subscribe(
      result => { this.userName = result.Profile.Username; }
    );
  }

  toggleUserNameEdit($event) {
    $event.preventDefault();
    this.passwordEditing = false;
    this.userNameEditing = !this.userNameEditing;
  }
  togglePasswordEdit($event) {
    $event.preventDefault();
    this.userNameEditing = false;
    this.passwordEditing = !this.passwordEditing;
  }

  ngOnDestroy() {
    this.user_service_subscription.unsubscribe();
  }


}
