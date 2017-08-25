import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Subscription } from 'rxjs/Subscription';
import { OfferService } from 'app/core/offer.service';
import { result, startsWith } from 'lodash';
import {IOffers} from '../../core/models/offers/offers.model';
import {AllOffersClass} from '../../core/models/offers/alloffers.model';
import {RenewalService} from '../../core/renewal.service';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy {

  private startsWith = startsWith;
  public ActiveServiceAccount: ServiceAccount = null;
  public IsUpForRenewal: boolean = null;
  public IsRenewalPending: boolean = null;
  public UpgradeOffers: IOffers[] = [];
  public AllOffers: AllOffersClass[] = [];

  ServiceAccountServiceSubscription: Subscription = null;
  RenewalServiceSubscription: Subscription = null;
  OfferServiceSubscription: Subscription = null;
  constructor(
    private ServiceAccountService: ServiceAccountService,
    private OfferService: OfferService,
    private RenewalService: RenewalService,
    private Router: Router
  ) { }

  ngOnInit() {
    this.ServiceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.RenewalService.getRenewalDetails(Number(this.ActiveServiceAccount.Id)).subscribe(
          RenewalDetails => {  this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
          this.IsRenewalPending = RenewalDetails.Is_Pending_Renewal;
            console.log('Renewal eligibility', this.IsUpForRenewal);
            console.log('Renewal status', this.IsRenewalPending);
            return this.IsUpForRenewal;
          });
      });
  }

  ngOnDestroy() {
    result(this.ServiceAccountServiceSubscription, 'unsubscribe');
    result(this.RenewalServiceSubscription, 'unsubscribe');
  }
}
