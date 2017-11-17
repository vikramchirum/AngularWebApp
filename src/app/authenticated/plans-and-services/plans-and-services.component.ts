import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { startsWith } from 'lodash';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from 'app//core/store/renewalstore';
import { UpgradeStore } from 'app/core/store/upgradestore';
import { OffersStore } from 'app//core/store/offersstore';
import { ModalStore } from 'app//core/store/modalstore';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss'],
  providers: [RenewalStore, UpgradeStore, ModalStore]
})
export class PlansAndServicesComponent implements OnInit, OnDestroy {

  renewalStoreSubscription: Subscription;
  serviceAccountServiceSubscription: Subscription = null;
  promoCodeSubscription: Subscription = null;
  promoCode: string = null;
  startsWith = startsWith;
  ActiveServiceAccount: ServiceAccount = null;
  IsUpForRenewal: boolean = null;
  IsRenewalPending: boolean = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private OfferStore: OffersStore,
    private renewalStore: RenewalStore,
    private Router: Router,
    private Route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.promoCodeSubscription = this.Route.queryParams.subscribe(params => { this.promoCode = params['pCode'] || null; });
    console.log('Promocode', this.promoCode);


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
        this.OfferStore.LoadRenewalOffersData(this.ActiveServiceAccount.Id);
      } else if (!this.IsUpForRenewal || this.ActiveServiceAccount.Current_Offer.IsHoldOverRate || this.IsRenewalPending) {
        // everything else is an upgrade
        this.OfferStore.LoadUpgradeOffersData(this.ActiveServiceAccount.Id);
      }
    });
  }

  ngOnDestroy() {
    this.renewalStoreSubscription.unsubscribe();
    this.serviceAccountServiceSubscription.unsubscribe();
    this.promoCodeSubscription.unsubscribe();
  }
}
