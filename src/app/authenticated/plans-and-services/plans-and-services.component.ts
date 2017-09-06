import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { result, startsWith } from 'lodash';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { OfferService } from 'app/core/offer.service';
import { IOffers } from '../../core/models/offers/offers.model';
import { AllOffersClass } from '../../core/models/offers/alloffers.model';
import { RenewalStore } from '../../core/store/RenewalStore';
import {IRenewalDetails} from '../../core/models/renewals/renewaldetails.model';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy {

  private renewalStoreSubscription: Subscription;
  private startsWith = startsWith;
  public ActiveServiceAccount: ServiceAccount = null;
  public RenewalDetails: IRenewalDetails = null;
  public IsUpForRenewal: boolean = null;
  public IsRenewalPending: boolean = null;
  public UpgradeOffers: IOffers[] = [];
  public AllOffers: AllOffersClass[] = [];

  ServiceAccountServiceSubscription: Subscription = null;
  OfferServiceSubscription: Subscription = null;
  constructor(
    private ServiceAccountService: ServiceAccountService,
    private OfferService: OfferService,
    private renewalStore: RenewalStore,
    private Router: Router
  ) { }

  ngOnInit() {

    this.ServiceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.renewalStore.LoadRenewalDetails(this.ActiveServiceAccount.Id);
      });

    this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(result => {
      if (result != null) {
        this.RenewalDetails = result;
        this.IsUpForRenewal = result.Is_Account_Eligible_Renewal;
        this.IsRenewalPending = result.Is_Pending_Renewal;
        if (this.IsUpForRenewal && !this.IsRenewalPending && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
          this.OfferService.RenewalOffersData(+this.ActiveServiceAccount.Id);
          console.log('**************************Renewals***************************');
        } else if (!this.IsUpForRenewal || this.ActiveServiceAccount.Current_Offer.IsHoldOverRate || this.IsRenewalPending) {
          this.OfferService.UpgradeOffersData(+this.ActiveServiceAccount.Id, +this.ActiveServiceAccount.Current_Offer.Term, +this.ActiveServiceAccount.TDU_DUNS_Number);
          console.log('**************************Upgrades***************************');
        }
      }
    });

  }

  ngOnDestroy() {
    result(this.ServiceAccountServiceSubscription, 'unsubscribe');
    result(this.renewalStoreSubscription, 'unsubscribe');
  }
}
