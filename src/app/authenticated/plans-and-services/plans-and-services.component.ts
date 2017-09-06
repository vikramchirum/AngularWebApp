import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { startsWith } from 'lodash';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { OfferService } from 'app/core/offer.service';
import { RenewalStore } from '../../core/store/RenewalStore';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy {

  renewalStoreSubscription: Subscription;
  serviceAccountServiceSubscription: Subscription = null;

  startsWith = startsWith;
  ActiveServiceAccount: ServiceAccount = null;
  IsUpForRenewal: boolean = null;
  IsRenewalPending: boolean = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private OfferService: OfferService,
    private renewalStore: RenewalStore,
    private Router: Router
  ) { }

  ngOnInit() {

    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.renewalStore.LoadRenewalDetails(this.ActiveServiceAccount.Id);
      });

    this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(renewalDetails => {
      this.IsUpForRenewal = renewalDetails.Is_Account_Eligible_Renewal;
      this.IsRenewalPending = renewalDetails.Is_Pending_Renewal;
      if (this.IsUpForRenewal && !this.IsRenewalPending && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        // this is just for renewals
        this.OfferService.RenewalOffersData(this.ActiveServiceAccount.Id);
      } else if (!this.IsUpForRenewal || this.ActiveServiceAccount.Current_Offer.IsHoldOverRate || this.IsRenewalPending) {
        // everything else is an upgrade
        this.OfferService.UpgradeOffersData(this.ActiveServiceAccount.Id, +this.ActiveServiceAccount.Current_Offer.Term, this.ActiveServiceAccount.TDU_DUNS_Number);
      }
    });
  }

  ngOnDestroy() {
    this.renewalStoreSubscription.unsubscribe();
    this.serviceAccountServiceSubscription.unsubscribe();
  }
}
