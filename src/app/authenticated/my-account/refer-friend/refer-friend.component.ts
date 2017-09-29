import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IReferral } from 'app/core/models/referrals/referral.model';

import { IEnrollReferralRequest } from 'app/core/models/referrals/enrollreferralrequest.model';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ReferralStore } from 'app/core/store/referralstore';

@Component({
  selector: 'mygexa-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit, OnDestroy {

  referralSubscription: Subscription;
  customerServiceAccountSubscription: Subscription;

  customerAccount: CustomerAccount;
  serviceAccount: ServiceAccount;
  referral: IReferral;
  serviceAccountsCount;

  flipButton: boolean = null;
  enrolled: boolean = null;
  isLoading = true;

  constructor(private serviceAccountService: ServiceAccountService, private customerAccountService: CustomerAccountService, private referralStore: ReferralStore) {
  }

  ngOnInit() {

    const customerAccount$ = this.customerAccountService.CustomerAccountObservable.filter(customerAccount => customerAccount != null);
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const referral$ = this.referralStore.Referral;

    this.customerServiceAccountSubscription = Observable.combineLatest(customerAccount$, activeServiceAccount$).distinctUntilChanged(null, x => x[1]).subscribe(result => {
      this.customerAccount = result[0];
      this.serviceAccount = result[1];
    });

    this.serviceAccountService.ServiceAccountsObservable.subscribe(serviceAccounts => {
      this.serviceAccountsCount = serviceAccounts.length;
    });

    this.referralSubscription = referral$.subscribe(result => {
      this.isLoading = false;
      this.referral = result;
      if (this.referral) {
        this.enrolled = true;
        console.log('the account is enrolled in referral.');
      }
    });
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
        console.log('Customer is enrolled in referral.');
      }
    });
  }

  ngOnDestroy() {
    this.referralSubscription.unsubscribe();
    this.customerServiceAccountSubscription.unsubscribe();
  }
}
