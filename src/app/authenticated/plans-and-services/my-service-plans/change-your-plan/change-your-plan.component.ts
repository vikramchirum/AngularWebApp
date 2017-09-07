import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { findKey, filter, find } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';
import { AllOffersClass} from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from '../../../../core/store/RenewalStore';
import {OffersStore} from '../../../../core/store/OffersStore';
import {Observable} from 'rxjs/Observable';
import {IRenewalDetails} from '../../../../core/models/renewals/renewaldetails.model';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, OnDestroy {

  public ActiveServiceAccountDetails: ServiceAccount = null;
  OffersServiceSubscription: Subscription;
  plansServicesSubscription: Subscription;
  Renewaldetails: IRenewalDetails = null;
  public IsUpForRenewal: boolean = null;
  public IsRenewalPending: boolean = null;
  public AllOffers: AllOffersClass[];
  public All_Offers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public BestRenewalOffer: IOffers;
  public UpgradeOffers: IOffers[];

  public AllOfferss: IOffers[];
  clicked: boolean;
  public upgradeOffersArraylength: number = null;
  havePromoCode = false;
  promoCode = '';

  constructor(private serviceAccount_service: ServiceAccountService, private OfferStore: OffersStore, private OfferService: OfferService, private renewalStore: RenewalStore) {
    this.clicked = true;
  }

  ngOnInit() {
    const activeServiceAccount$ = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1].Service_Account_Id).subscribe(result => {
      this.ActiveServiceAccountDetails = result[0]; this.Renewaldetails = result[1];
      this.IsUpForRenewal = result[1].Is_Account_Eligible_Renewal;
      this.IsRenewalPending = result[1].Is_Pending_Renewal;
      // if (this.IsUpForRenewal && !this.IsRenewalPending && !this.ActiveServiceAccountDetails.Current_Offer.IsHoldOverRate) {
      //   this.OffersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
      //     All_Offers => {
      //       // console.log('All offers', All_Offers);
      //       if (All_Offers != null) {
      //         this.extractOffers(All_Offers);
      //       }
      //       return All_Offers;
      //     }
      //   );
      // } else if (!this.IsUpForRenewal || this.ActiveServiceAccountDetails.Current_Offer.IsHoldOverRate || this.IsRenewalPending) {
      //   this.OffersServiceSubscription = this.OfferStore.ServiceAccount_UpgradeOffers.subscribe(
      //     Upgrade_Offers => {
      //       this.UpgradeOffers = Upgrade_Offers;
      //       // console.log('All upgrade offers', this.UpgradeOffers);
      //       if (this.UpgradeOffers) {
      //         this.upgradeOffersArraylength = Upgrade_Offers.length;
      //       }
      //       return this.UpgradeOffers;
      //     }
      //   );
      // }
    });
    // this.ServiceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
    //   result => {
    //     this.ActiveServiceAccountDetails = result;
    //     this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(
    //       RenewalDetails => {
    //
    //         if (RenewalDetails == null) {
    //           return;
    //         }
    //     this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
    //     this.IsRenewalPending = RenewalDetails.Is_Pending_Renewal;
    //     if (this.IsUpForRenewal && !this.IsRenewalPending && !this.ActiveServiceAccountDetails.Current_Offer.IsHoldOverRate) {
    //       this.OffersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
    //         All_Offers => {
    //            // console.log('All offers', All_Offers);
    //           if (All_Offers != null) {
    //             this.extractOffers(All_Offers);
    //           }
    //           return All_Offers;
    //         }
    //       );
    //     } else if (!this.IsUpForRenewal || this.ActiveServiceAccountDetails.Current_Offer.IsHoldOverRate || this.IsRenewalPending) {
    //       this.OffersServiceSubscription = this.OfferStore.ServiceAccount_UpgradeOffers.subscribe(
    //         Upgrade_Offers => {
    //           this.UpgradeOffers = Upgrade_Offers;
    //           // console.log('All upgrade offers', this.UpgradeOffers);
    //           if (this.UpgradeOffers) {
    //             this.upgradeOffersArraylength = Upgrade_Offers.length;
    //           }
    //           return this.UpgradeOffers;
    //         }
    //       );
    //     }
    //   }
    // );
    //     return this.ActiveServiceAccountDetails;
    //   });
  }
  //
  // extractOffers(All_Offers: AllOffersClass[]) {
  //   this.FeaturedOffers = All_Offers.filter(item => item.Type === 'Featured_Offers');
  //   if ( this.FeaturedOffers[0].Offers.length > 0) {
  //     console.log('All_Featured_Offers', this.FeaturedOffers);
  //     this.BestRenewalOffer = this.FeaturedOffers[0].Offers[0];
  //     console.log('Best_Featured_Offer', this.BestRenewalOffer);
  //   }
  //   this.AllOffers = All_Offers.filter(item => item.Type === 'All_Offers');
  //   if (this.AllOffers[0].Offers.length > 0) {
  //     this.AllOfferss = this.AllOffers[0].Offers;
  //     console.log('Rest_All_Offers', this.AllOffers);
  //   }
  // }

  ngOnDestroy() {
    this.plansServicesSubscription.unsubscribe();
    this.OffersServiceSubscription.unsubscribe();

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
