import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
import {OfferService} from '../../../../core/offer.service';
import {AllOffersClass, IOffers} from '../../../../core/models/offer.model';
import { findKey, filter, find } from 'lodash';
import {ChangeYourPlanCardComponent} from './change-your-plan-card/change-your-plan-card.component';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, OnDestroy {
  public IsInRenewalTimeFrame: boolean;
  ActiveBillingAccountDetails: BillingAccountClass;
  billingAccountSubscription: Subscription;
  activebillingAccountOffersSubscription: Subscription;
  public All_Offers: AllOffersClass;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers[];
  public AllOffers: AllOffersClass[];
  public AllOfferss: IOffers[];
  clicked: boolean;

  @ViewChild(ChangeYourPlanCardComponent) private ChangePlanCard: ChangeYourPlanCardComponent;

  constructor(private billingAccount_service: BillingAccountService, private active_billingaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
    this.clicked = false;
  }

  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
    this.activebillingAccountOffersSubscription = this.active_billingaccount_service.ActiveBillingAccountOfferObservable.subscribe(
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
    this.billingAccountSubscription.unsubscribe();
  }
  ChevClicked() {
    this.clicked = !this.clicked ;
  }
}
