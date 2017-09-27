import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { findKey, filter, find } from 'lodash';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { IRenewalDetails } from 'app/core/models/renewals/renewaldetails.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';
import { UtilityService } from 'app/core/utility.service';

import { OffersStore} from 'app/core/store/offersstore';
import { RenewalStore } from 'app/core/store/renewalstore';
import { ModalStore } from 'app/core/store/modalstore';

import { PlanConfirmationModalComponent } from '../plan-confirmation-modal/plan-confirmation-modal.component';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('planConfirmationModal') planConfirmationModal: PlanConfirmationModalComponent;
  @Input() promoCode: string;

  isLoading = true;
  isLoadingUpgrades = false;
  isLoadingRenewals = false;

  renewalDetails: IRenewalDetails = null;
  activeServiceAccountDetails: ServiceAccount = null;

  hasPromoCode = false;
  showRenewals: boolean;
  resetOffer: boolean = null;

  featuredOffers: AllOffersClass[];
  allOffers: AllOffersClass[];

  bestRenewalOffer: IOffers;
  renewalOffers: IOffers[];
  upgradeOffers: IOffers[];

  offersServiceSubscription: Subscription;
  plansServicesSubscription: Subscription;

  constructor(private serviceAccount_service: ServiceAccountService, private OfferStore: OffersStore, private offerService: OfferService, private renewalStore: RenewalStore
    , private modalStore: ModalStore, private utilityService: UtilityService) {
  }

  ngOnInit() {

    const activeServiceAccount$ = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;

    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1]).subscribe(result => {
      this.isLoading = false;
      this.activeServiceAccountDetails = result[0];
      this.renewalDetails = result[1];
      this.populateOffers();
    });
  }

  ngAfterViewInit() {
    this.modalStore.PlanConfirmationModal.distinctUntilChanged(null, x => x).subscribe(result => {
      this.planConfirmationModal.showPlanConfirmationModal(result);
    });
  }

  private populateOffers(): void {
    this.showRenewals = this.renewalDetails.Is_Account_Eligible_Renewal && ! this.activeServiceAccountDetails.Current_Offer.IsHoldOverRate;
    if (this.showRenewals) {
      if (!this.utilityService.isNullOrWhitespace(this.promoCode) && !this.resetOffer) {
        this.showPromoCodeInput(null);
        this.onPromoCodeSubmit(null);
      } else {
        this.isLoadingRenewals = true;
        this.offersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
          allOffers => {
            this.isLoadingRenewals = false;
            if (allOffers) {
              this.extractOffers(allOffers);
            }
          }
        );
      } } else {

      this.isLoadingUpgrades = true;
      this.offersServiceSubscription = this.OfferStore.ServiceAccount_UpgradeOffers.subscribe(
        upgradeOffers => {
          this.isLoadingUpgrades = false;
          this.upgradeOffers = upgradeOffers;
        }
      );
    }}

  private extractOffers(allOffers: AllOffersClass[]): void {
    this.featuredOffers = allOffers.filter(item => item.Type === 'Featured_Offers');
    if (this.featuredOffers.length > 0 && this.featuredOffers[0].Offers.length > 0) {
      this.bestRenewalOffer = this.featuredOffers[0].Offers[0];
    }
    this.allOffers = allOffers.filter(item => item.Type === 'All_Offers');
    if (this.allOffers.length > 0 && this.allOffers[0].Offers.length > 0) {
      this.renewalOffers = this.allOffers[0].Offers;
    }
  }

  showPromoCodeInput($event: Event) {

    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    if (!this.utilityService.isNullOrWhitespace((this.promoCode))) {
      // if ever the promo code is present do not flip flop the promo code input in the UI
      this.hasPromoCode = true;
    } else {
      this.hasPromoCode = !this.hasPromoCode;
    }
  }

  onPromoCodeSubmit($event: Event) {

    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    this.fetchOffersByPromoCode(this.promoCode);
  }

  fetchOffersByPromoCode(promoCode) {

    if (this.utilityService.isNullOrWhitespace((this.promoCode))) {
      return;
    }
    this.isLoadingRenewals = true;
    this.offersServiceSubscription = this.offerService.getRenewalPlansByPromoCode(promoCode, this.activeServiceAccountDetails.TDU_DUNS_Number).subscribe(
      result => {
        this.isLoadingRenewals = false;
        this.renewalOffers = result;
      }
    );
  }

  resetOffers() {
    this.resetOffer = true;
    this.populateOffers();
  }

  ngOnDestroy() {
    if (this.offersServiceSubscription) {
      this.offersServiceSubscription.unsubscribe();
    }
    this.plansServicesSubscription.unsubscribe();
  }
}
