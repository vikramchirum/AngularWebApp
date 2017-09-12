import {Component, OnInit, OnDestroy, Input} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { findKey, filter, find } from 'lodash';
import { ChangeYourPlanCardComponent } from './change-your-plan-card/change-your-plan-card.component';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';
import { AllOffersClass, UpgradeOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from '../../../../core/store/RenewalStore';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, OnDestroy {

  renewalStoreSubscription: Subscription;
  public ActiveServiceAccountDetails: ServiceAccount = null;
  ServiceAccountSubscription: Subscription;
  OffersServiceSubscription: Subscription;
  RenewalServiceSubscription: Subscription;

  public IsUpForRenewal: boolean = null;

  public AllOffers: AllOffersClass[];
  public All_Offers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public BestRenewalOffer: IOffers[];
  public UpgradeOffers: IOffers[];

  public AllOfferss: IOffers[];
  clicked: boolean;
  public upgradeOffersArraylength: number = null;
  havePromoCode = false;
  promoCode = '';

  constructor(private serviceAccount_service: ServiceAccountService, private OfferService: OfferService, private renewalStore: RenewalStore) {
    this.clicked = true;
  }

  ngOnInit() {

    this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(
      RenewalDetails => {

        if (RenewalDetails == null) {
          return;
        }

        this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
        if (this.IsUpForRenewal === true) {
          this.OffersServiceSubscription = this.OfferService.getRenewalOffers(Number(this.ActiveServiceAccountDetails.Id)).subscribe(
            All_Offers => {
              console.log('All offers', All_Offers);
              this.extractOffers(All_Offers);
              return All_Offers;
            }
          );
        } else if (this.IsUpForRenewal === false || this.ActiveServiceAccountDetails.Current_Offer.IsHoldOverRate) {
          this.OffersServiceSubscription = this.OfferService.getUpgradeOffers(Number(this.ActiveServiceAccountDetails.Id), Number(this.ActiveServiceAccountDetails.Current_Offer.Term), Number(this.ActiveServiceAccountDetails.TDU_DUNS_Number))
            .subscribe(
              Upgrade_Offers => {
                this.UpgradeOffers = Upgrade_Offers;
                console.log('All upgrade offers', this.UpgradeOffers);
                return this.UpgradeOffers;
              }
            );
        }
      }
    );

    this.ServiceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        return this.ActiveServiceAccountDetails;
      });
  }

  extractOffers(All_Offers: AllOffersClass[]) {
    this.FeaturedOffers = All_Offers.filter(item => item.Type === 'Featured_Offers');
    console.log('All_Featured_Offers', this.FeaturedOffers);
    this.BestRenewalOffer = this.FeaturedOffers[0].Offers;
    console.log('Best_Featured_Offer', this.BestRenewalOffer);

    this.AllOffers = All_Offers.filter(item => item.Type === 'All_Offers');
    this.AllOfferss = this.AllOffers[0].Offers;
    console.log('Rest_All_Offers', this.AllOffers);
  }

  ngOnDestroy() {
    this.renewalStoreSubscription.unsubscribe();
    this.ServiceAccountSubscription.unsubscribe();
    this.RenewalServiceSubscription.unsubscribe();
    if (this.IsUpForRenewal) {
      this.OffersServiceSubscription.unsubscribe();
    }
  }
  ChevClicked() {
    this.clicked = !this.clicked;
  }

  showPromoCodeInput() {
    this.havePromoCode = !this.havePromoCode;
  }

  onPromoCodeSubmit() {
    this.fetchOffersByPromoCode(this.promoCode);
  }

  fetchOffersByPromoCode(promoCode) {
    this.OffersServiceSubscription = this.OfferService.getRenewalPlansByPromoCode(promoCode).subscribe(
      result => {
        console.log('Renewal offers based on Promo code', result);
        this.AllOfferss = result;
      }
    );
  }
}
