import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OfferService } from 'app/core/offer.service';
import { findKey, filter, find } from 'lodash';
import {AllOffersClass, UpgradeOffersClass} from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import {IRenewalDetails} from '../../../../core/models/renewals/renewaldetails.model';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ActiveServiceAccount: ServiceAccount;
  @Input() RenewalDetails: IRenewalDetails;
  OffersServiceSubscription: Subscription;

  public IsUpForRenewal: boolean = null;
  public IsRenewalPending: boolean = null;

  public AllOffers: AllOffersClass[];
  public All_Offers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public BestRenewalOffer: IOffers[];
  public UpgradeOffers: IOffers[];

  public AllOfferss: IOffers[];
  clicked: boolean;
  public upgradeOffersArraylength: number = null;
  havePromoCode = false;

  constructor(private OfferService: OfferService) {
    this.clicked = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['RenewalDetails'] && this.ActiveServiceAccount && this.RenewalDetails) {
        this.IsUpForRenewal = this.RenewalDetails.Is_Account_Eligible_Renewal;
        this.IsRenewalPending = this.RenewalDetails.Is_Pending_Renewal;
        if (this.IsUpForRenewal === true && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate && !this.IsRenewalPending) {
          this.OffersServiceSubscription = this.OfferService.getRenewalOffers(Number(this.ActiveServiceAccount.Id)).subscribe(
            All_Offers => {
              console.log('All offers', All_Offers);
              this.extractOffers(All_Offers);
              return All_Offers;
            }
          );
        } else {
          this.OffersServiceSubscription = this.OfferService.getUpgradeOffers(Number(this.ActiveServiceAccount.Id),
            Number(this.ActiveServiceAccount.Current_Offer.Term),
            Number(this.ActiveServiceAccount.TDU_DUNS_Number))
            .subscribe(
              Upgrade_Offers => { this.UpgradeOffers = Upgrade_Offers;
                console.log('All upgrade offers', this.UpgradeOffers);
                return this.UpgradeOffers;
              }
            );
        }
    }
  }

  ngOnInit() {

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
    if (this.IsUpForRenewal) {
      this.OffersServiceSubscription.unsubscribe();
    }
  }
  ChevClicked() {
    this.clicked = !this.clicked ;
  }

  showPromoCodeInput() {
    this.havePromoCode = !this.havePromoCode;
  }
}
