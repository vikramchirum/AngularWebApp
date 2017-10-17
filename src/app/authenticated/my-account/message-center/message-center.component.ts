import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from 'app/core/user.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { ServiceAccountService} from 'app/core/serviceaccount.service';

import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit, OnDestroy {

  serviceAccountsSubscription: Subscription;
  userservicesubscription: Subscription;
  customerServiceSubscription: Subscription;

  customerDetails: CustomerAccount = null;
  emailAddress: string;
  phoneNumber: string;
  serviceAccountsCount;

  constructor(private serviceAccountService: ServiceAccountService, private customerAccountService: CustomerAccountService, private userService: UserService) {
  }

  ngOnInit() {

    this.customerServiceSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
        if (this.customerDetails.Primary_Phone && this.customerDetails.Primary_Phone.Area_Code && this.customerDetails.Primary_Phone.Number) {
           this.phoneNumber = this.customerDetails.Primary_Phone.Area_Code.concat( this.customerDetails.Primary_Phone.Number);
        } else {
          this.phoneNumber = this.customerDetails.Primary_Phone.Number;
        }
      });

    this.userservicesubscription = this.userService.UserObservable.subscribe(
      result => this.emailAddress = result.Profile.Email_Address
    );

    this.serviceAccountsSubscription = this.serviceAccountService.ServiceAccountsObservable.subscribe(serviceAccounts => {
      this.serviceAccountsCount = serviceAccounts.length;
    });
  }

  ngOnDestroy() {
    this.customerServiceSubscription.unsubscribe();
    this.userservicesubscription.unsubscribe();
    this.serviceAccountsSubscription.unsubscribe();
  }
}
