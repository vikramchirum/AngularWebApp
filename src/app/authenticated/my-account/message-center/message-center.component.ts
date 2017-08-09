import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import { result } from 'lodash';
import {UserService} from 'app/core/user.service';
import {CustomerAccountService} from 'app/core/CustomerAccount.service';
import {CustomerAccount} from 'app/core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit, OnDestroy {

  emailEditing: boolean;
  userservicesubscription: Subscription;
  customerServiceSubscription: Subscription;
  customerDetails: CustomerAccount = null;
  emailAddress: string;

  constructor(
    private customerAccountService: CustomerAccountService,
    private userService: UserService
  ) {
    this.emailEditing = false;
  }

  ngOnInit() {
    this.customerServiceSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => this.customerDetails = result
    );
    this.userservicesubscription = this.userService.UserObservable.subscribe(
      result => this.emailAddress = result.Profile.Email_Address
    );
  }

  ngOnDestroy() {
    result(this.customerServiceSubscription, 'unsubscribe');
    result(this.userservicesubscription, 'unsubscribe');
  }

  toggleEmailEdit($event) {
    $event.preventDefault();
    this.emailEditing = !this.emailEditing;
  }

}
