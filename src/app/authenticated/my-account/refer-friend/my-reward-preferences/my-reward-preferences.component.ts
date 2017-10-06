import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IReferral } from 'app/core/models/referrals/referral.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { IEnrollReferralRequest } from 'app/core/models/referrals/enrollreferralrequest.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { ReferralStore } from 'app/core/store/referralstore';

@Component({
  selector: 'mygexa-my-reward-preferences',
  templateUrl: './my-reward-preferences.component.html',
  styleUrls: ['./my-reward-preferences.component.scss']
})
export class MyRewardPreferencesComponent implements OnInit, OnDestroy {

  referralSubscription: Subscription;
  customerAccountSubscription: Subscription;

  customerAccount: CustomerAccount;
  serviceAccounts: ServiceAccount[];
  selectedServiceAccount: ServiceAccount;

  referral: IReferral;
  isLoading = true;

  constructor(private serviceAccountService: ServiceAccountService, private customerAccountService: CustomerAccountService, private referralStore: ReferralStore) {
  }

  ngOnInit() {

    const customerAccount$ = this.customerAccountService.CustomerAccountObservable.filter(customerAccount => customerAccount != null);
    const serviceAccounts$ = this.serviceAccountService.ServiceAccountsObservable.filter(serviceAccounts => serviceAccounts != null);
    const referral$ = this.referralStore.Referral;

    this.isLoading = false;

    this.customerAccountSubscription = customerAccount$.subscribe(customerAccount => {
      this.customerAccount = customerAccount;
    });

    this.referralSubscription = Observable.combineLatest(serviceAccounts$, referral$).subscribe(result => {
      this.serviceAccounts = result[0];
      this.referral = result[1];

      if (this.referral) {
        this.selectedServiceAccount = this.serviceAccounts.filter(x => {
          return x.Id === this.referral.Service_Account_Id;
        })[0];
      }
    });
  }

  serviceChanged(event) {
    this.selectedServiceAccount = event;
  }

  changeRewardPreferences() {

    const request = {} as   IEnrollReferralRequest;
    request.Customer_Account_Id = this.customerAccount.Id;
    request.Service_Account_Id = this.selectedServiceAccount.Id;

    this.referralStore.changeRewardPreferences(request).subscribe(result => {
      if (result) {
        console.log('Customer reward preferences are changed.');
      }
    });
  }

  ngOnDestroy() {
    this.customerAccountSubscription.unsubscribe();
    this.referralSubscription.unsubscribe();
  }
}
