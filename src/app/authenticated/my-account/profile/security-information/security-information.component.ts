import { Component, OnDestroy, OnInit } from '@angular/core';

import { result } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from 'app/core/user.service';

@Component({
  selector: 'mygexa-security-information',
  templateUrl: './security-information.component.html',
  styleUrls: ['./security-information.component.scss']
})
export class SecurityInformationComponent implements OnInit, OnDestroy {

  userName: string = null;
  userNameEditing: boolean = null;
  passwordEditing: boolean = null;
  submitAttempt: boolean = null;

  UserServiceSubscription: Subscription = null;

  constructor(
    private UserService: UserService
  ) { }

  ngOnInit() {
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => this.userName = result.Profile.Username
    );
  }

  toggleUserNameEdit($event) {
    result($event, 'preventDefault');
    this.userNameEditing = !this.userNameEditing;
  }
  togglePasswordEdit($event) {
    result($event, 'preventDefault');
    this.passwordEditing = !this.passwordEditing;
  }

  ngOnDestroy() {
    result(this.UserServiceSubscription, 'unsubscribe');
  }

}
