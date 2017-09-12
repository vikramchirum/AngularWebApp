import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ServiceAccountService } from '../../../core/serviceaccount.service';
import { ReferralStore } from '../../../core/store/referralstore';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { CustomerAccountService } from '../../../core/CustomerAccount.service';
import { IEnrollReferralRequest } from '../../../core/models/referrals/enrollreferralrequest.model';
import { ServiceAccount } from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit, OnDestroy {

  referralSubscription: Subscription;
  customerAccount: CustomerAccount;
  serviceAccount: ServiceAccount;

  flipButton: boolean = null;
  enrolled: boolean = null;

  constructor(private serviceAccountService: ServiceAccountService, private customerAccountService: CustomerAccountService, private referralStore: ReferralStore) {
  }

  toggleButton(): void {
    this.flipButton = !this.flipButton;
  }

  onEnroll() {

    const request = {} as   IEnrollReferralRequest;
    request.Customer_Account_Id = this.serviceAccount.Customer_Account_Id;
    request.Service_Account_Id = this.serviceAccount.Id;

    this.referralStore.enrollReferral(request).subscribe(result => {
      if (result) {
        console.log('Customer enrolled in referral.');
      }
    });
  }

  ngOnInit() {

    const customerAccount$ = this.customerAccountService.CustomerAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const referral$ = this.referralStore.Referral;

    Observable.combineLatest(customerAccount$, activeServiceAccount$).subscribe(result => {
      this.customerAccount = result[0];
      this.serviceAccount = result[1];
    });

    referral$.subscribe(result => {
      this.enrolled = true;
      console.log('got the referral.');
    });
  }

  ngOnDestroy() {

  }
}
