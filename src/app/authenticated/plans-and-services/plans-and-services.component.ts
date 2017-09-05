import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { startsWith } from 'lodash';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from '../../core/store/RenewalStore';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy {

  renewalStoreSubscription: Subscription;
  serviceAccountServiceSubscription: Subscription = null;

  ActiveServiceAccount: ServiceAccount = null;
  IsUpForRenewal: boolean = null;
  startsWith= startsWith;

  constructor(private ServiceAccountService: ServiceAccountService,
              private renewalStore: RenewalStore,
              private Router: Router) {
  }

  ngOnInit() {

    this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(result => {
      this.IsUpForRenewal = result.Is_Account_Eligible_Renewal;
    });

    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.renewalStore.LoadRenewalDetails(this.ActiveServiceAccount.Id);
      });
  }

  ngOnDestroy() {
    this.renewalStoreSubscription.unsubscribe();
    this.serviceAccountServiceSubscription.unsubscribe();
  }
}
