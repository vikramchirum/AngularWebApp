import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { startsWith } from 'lodash';
import { CustomerAccountStore } from '../../core/store/CustomerAccountStore';
import { UserService } from '../../core/user.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {
  UserServiceSubscription: Subscription;
  private startsWith = startsWith;
  constructor(
    private Router: Router,
    private UserService: UserService,
    private CustomerAccountStore: CustomerAccountStore
  ) {}
  ngOnInit() {
    this.UserServiceSubscription = this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => {
        this.CustomerAccountStore.LoadCustomerDetails(CustomerAccountId);
      }
    );
  }
  ngOnDestroy() {
    this.UserServiceSubscription.unsubscribe();
  }
}
