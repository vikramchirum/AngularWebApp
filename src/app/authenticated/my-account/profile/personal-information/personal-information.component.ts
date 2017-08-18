import { Component, OnDestroy, OnInit } from '@angular/core';

import { result } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { UserService } from 'app/core/user.service';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {

  emailAddress: string = null;
  emailEditing: boolean = null;
  phoneEditing: boolean = null;
  accountNumber: string = null;
  customerDetails: CustomerAccount = null;
  CustomerAccountServiceSubscription: Subscription = null;
  UserServiceSubscription: Subscription = null;

  constructor(
    private CustomerAccountService: CustomerAccountService,
    private UserService: UserService
  ) { }

  ngOnInit() {
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => { this.customerDetails = result; }
    );
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => {
        this.accountNumber = result.Account_permissions.filter(x => x.AccountType === 'Customer_Account_Id')[0].AccountNumber;
        this.emailAddress = result.Profile.Email_Address;
      }
    );
  }
  toggleEmailEdit($event) {
    result($event, 'preventDefault');
    this.emailEditing = !this.emailEditing;
  }

  togglePhoneEdit($event) {
    result($event, 'preventDefault');
    this.phoneEditing = !this.phoneEditing;
  }

  ngOnDestroy() {
    result(this.CustomerAccountServiceSubscription, 'unsubscribe');
    result(this.UserServiceSubscription, 'unsubscribe');
  }

}
