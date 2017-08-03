import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { OfferService } from 'app/core/offer.service';
import { findKey, filter, find } from 'lodash';
import { ChangeYourPlanCardComponent } from './change-your-plan-card/change-your-plan-card.component';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, OnDestroy {
  public IsInRenewalTimeFrame: boolean;
  ActiveServiceAccountDetails: ServiceAccount;
  serviceAccountSubscription: Subscription;
  activeserviceAccountOffersSubscription: Subscription;
  public All_Offers: AllOffersClass;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers[];
  public AllOffers: AllOffersClass[];
  public AllOfferss: IOffers[];
  clicked: boolean;
  havePromoCode:boolean = false;

  constructor(private serviceAccount_service: ServiceAccountService, private active_serviceaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
    this.clicked = true;
  }

  ngOnInit() {
    this.serviceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
    this.activeserviceAccountOffersSubscription = this.active_serviceaccount_service.ActiveServiceAccountOfferObservable.subscribe(
      all_offers => {
        this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
        this.RenewalOffers = this.FeaturedOffers[0].Offers;
        console.log('Featured_Offers', this.RenewalOffers);

        this.AllOffers = all_offers.filter(item => item.Type === 'All_Offers');
        this.AllOfferss = this.AllOffers[0].Offers;
        console.log('All_Offers', this.AllOfferss);
      });
  }

  ngOnDestroy() {
    this.serviceAccountSubscription.unsubscribe();
  }
  ChevClicked() {
    this.clicked = !this.clicked ;
  }

  showPromoCodeInput(){
    this.havePromoCode = !this.havePromoCode;
  }
}
