import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { startsWith } from 'lodash';
import { CustomerAccountStore } from '../../core/store/CustomerAccountStore';
import { UserService } from '../../core/user.service';
import {Subscription} from 'rxjs/Subscription';
import { ReferralStore } from '../../core/store/referralstore';
import { CustomerAccountService } from '../../core/CustomerAccount.service';

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
    private referralStore: ReferralStore,
    private UserService: UserService,
    private CustomerAccountStore: CustomerAccountStore,
    private customerAccountService: CustomerAccountService,
  ) {}
  ngOnInit() {
    this.customerAccountService.CustomerAccountObservable.subscribe(result => {
      this.referralStore.loadReferral(result.Id);
    });
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
