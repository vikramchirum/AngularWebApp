import {Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { findKey, filter, find } from 'lodash';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IUser } from 'app/core/models/user/User.model';

import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { IRenewalDetails } from '../../../../core/models/renewals/renewaldetails.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';

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
  @Input() pCode: string;

  renewalDetails: IRenewalDetails = null;
  activeServiceAccountDetails: ServiceAccount = null;
  user: IUser;

  isAccountEligibleRenewal: boolean;
  isRenewalPending: boolean;
  isOnHoldOver: boolean;
  showRenewals: boolean;

  featuredOffers: AllOffersClass[];
  allOffers: AllOffersClass[];

  bestRenewalOffer: IOffers;
  renewalOffers: IOffers[];
  upgradeOffers: IOffers[];

  renewalOffersCount: number;
  upgradeOffersCount: number;

  offersServiceSubscription: Subscription;
  plansServicesSubscription: Subscription;

  havePromoCode = false;
  promoCode = '';

  constructor(private serviceAccount_service: ServiceAccountService, private OfferStore: OffersStore, private offerService: OfferService, private renewalStore: RenewalStore
    , private modalStore: ModalStore, private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {

    const activeServiceAccount$ = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;

    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1]).subscribe(result => {
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

  showPromoCodeInput() {
    this.havePromoCode = !this.havePromoCode;
  }

  onPromoCodeSubmit() {
    this.fetchOffersByPromoCode(this.promoCode);
  }

  fetchOffersByPromoCode(promoCode) {
    this.offersServiceSubscription = this.offerService.getRenewalPlansByPromoCode(promoCode).subscribe(
      result => {
        this.renewalOffers = result;
        if (this.renewalOffers) {
          this.renewalOffersCount = this.renewalOffers.length;
        }
      }
    );
  }

  private populateOffers(): void {

    this.isOnHoldOver = this.activeServiceAccountDetails.Current_Offer.IsHoldOverRate;
    this.isAccountEligibleRenewal = this.renewalDetails.Is_Account_Eligible_Renewal;
    this.isRenewalPending = this.renewalDetails.Is_Pending_Renewal;
    this.showRenewals = this.isAccountEligibleRenewal && !this.isRenewalPending && !this.isOnHoldOver;
    if (this.showRenewals) {
      this.offersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
        allOffers => {
          if (allOffers) {
            this.extractOffers(allOffers);
          }
        }
      );
      if (this.pCode != null) {
        this.promoCode = this.pCode;
        this.showPromoCodeInput();
      }
    } else {
      this.offersServiceSubscription = this.OfferStore.ServiceAccount_UpgradeOffers.subscribe(
        upgradeOffers => {
          this.upgradeOffers = upgradeOffers;
          if (this.upgradeOffers) {
            this.upgradeOffersCount = upgradeOffers.length;
          }
        }
      );
    }
  }

  private extractOffers(allOffers: AllOffersClass[]): void {
    this.featuredOffers = allOffers.filter(item => item.Type === 'Featured_Offers');
    if (this.featuredOffers.length > 0 && this.featuredOffers[0].Offers.length > 0) {
      this.bestRenewalOffer = this.featuredOffers[0].Offers[0];
    }
    this.allOffers = allOffers.filter(item => item.Type === 'All_Offers');
    if (this.allOffers.length > 0 && this.allOffers[0].Offers.length > 0) {
      this.renewalOffers = this.allOffers[0].Offers;
      if (this.renewalOffers) {
        this.renewalOffersCount = this.renewalOffers.length;
      }
    }
  }

  ngOnDestroy() {
    this.plansServicesSubscription.unsubscribe();
  }
}
