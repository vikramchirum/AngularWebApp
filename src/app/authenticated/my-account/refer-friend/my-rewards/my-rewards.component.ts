import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { sumBy } from 'lodash';

import { environment } from 'environments/environment';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { IReferral } from 'app/core/models/referrals/referral.model';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ReferralStore } from 'app/core/store/referralstore';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit, OnDestroy {

  customerServiceAccountSubscription: Subscription;
  referralSubscription: Subscription;

  isLoading = true;
  referral: IReferral;
  customerAccount: CustomerAccount;
  serviceAccount: ServiceAccount;
  totalSavingsToDate: number;
  dollarAmountFormatter: string;

  constructor(private customerAccountService: CustomerAccountService, private serviceAccountService: ServiceAccountService, private referralStore: ReferralStore) {
  }
  ngOnInit() {

    this.dollarAmountFormatter = environment.DollarAmountFormatter;

    const customerAccount$ = this.customerAccountService.CustomerAccountObservable.filter(customerAccount => customerAccount != null);
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const referral$ = this.referralStore.Referral;

    this.customerServiceAccountSubscription = Observable.combineLatest(customerAccount$, activeServiceAccount$).distinctUntilChanged(null, x => x[1]).subscribe(result => {
      this.customerAccount = result[0];
      this.serviceAccount = result[1];
    });

    this.referralSubscription = referral$.subscribe(result => {
      this.isLoading = false;
      this.referral = result;
      this.totalSavingsToDate = (sumBy(this.referral.RefereeList, function (r) {
        return r.Total_Amount_Credited;
      }));
    });
  }

  ngOnDestroy() {
    this.customerServiceAccountSubscription.unsubscribe();
    this.referralSubscription.unsubscribe();
  }
}
