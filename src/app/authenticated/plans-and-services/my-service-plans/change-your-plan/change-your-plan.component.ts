import {Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit, SimpleChanges, OnChanges} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { findKey, filter, find, uniq } from 'lodash';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { CustomerAccount} from '../../../../core/models/customeraccount/customeraccount.model';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { IRenewalDetails } from 'app/core/models/renewals/renewaldetails.model';
import { OfferSelectionType } from 'app/core/models/enums/offerselectiontype';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';
import { UtilityService } from 'app/core/utility.service';

import { OffersStore} from 'app/core/store/offersstore';
import { RenewalStore } from 'app/core/store/renewalstore';
import { UpgradeStore } from 'app/core/store/upgradestore';
import { ModalStore } from 'app/core/store/modalstore';

import { PlanConfirmationModalComponent } from '../plan-confirmation-modal/plan-confirmation-modal.component';
import { ErrorModalComponent } from 'app/shared/components/error-modal/error-modal.component';
import { IOfferSelectionPayLoad } from 'app/shared/models/offerselectionpayload';
import { ICreateRenewalRequest } from 'app/core/models/renewals/createrenewalrequest.model';
import { ICreateUpgradeRequest } from 'app/core/models/upgrades/createupgraderequest.model';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('errorModal') errorModal: ErrorModalComponent;
  @ViewChild('planConfirmationModal') planConfirmationModal: PlanConfirmationModalComponent;
  @Input() promoCode: string;

  isLoading = true;
  isLoadingUpgrades = false;
  isLoadingRenewals = false;

  customerDetails: CustomerAccount;
  activeServiceAccountDetails: ServiceAccount;
  renewalDetails: IRenewalDetails = null;

  hasPromoCode = false;
  showRenewals: boolean;

  offerSelectionType = OfferSelectionType;

  featuredOffers: AllOffersClass[];
  allOffers: AllOffersClass[];

  bestRenewalOffer: IOffers;
  renewalOffers: IOffers[];
  upgradeOffers: IOffers[];

  renewalOffersLegalTextArray: string[] = [];
  upgradeOffersLegalTextArray: string[] = [];


  offersServiceSubscription: Subscription;
  plansServicesSubscription: Subscription;
  customerAccountServiceSubscription: Subscription;

  constructor(private serviceAccount_service: ServiceAccountService, private customerAccountService: CustomerAccountService, private OfferStore: OffersStore
    , private offerService: OfferService, private renewalStore: RenewalStore, private upgradeStore: UpgradeStore, private modalStore: ModalStore
    ,  private utilityService: UtilityService) {
  }

  ngOnInit() {

    this.customerAccountServiceSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(result => {
      this.customerDetails = result;
    });

  }

  ngAfterViewInit() {
  }

  // getRespectiveAsterik(offer_legal_Text: string): string {
  //   let result: string[];
  //   result = offer_legal_Text.split(' ', 2);
  //   const symbol =  result[0];
  //   return symbol;
  // }

  private initialize() {

    const activeServiceAccount$ = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;

    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1]).subscribe(result => {
      this.isLoading = false;
      this.activeServiceAccountDetails = result[0];
      this.renewalDetails = result[1];
      this.populateOffers();
    });
  }

  private populateOffers(): void {
    this.showRenewals = this.renewalDetails.Is_Account_Eligible_Renewal && !this.activeServiceAccountDetails.Current_Offer.IsHoldOverRate;
    if (this.showRenewals) {
      if (!this.utilityService.isNullOrWhitespace(this.promoCode)) {
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
      }
    } else {
      this.isLoadingUpgrades = true;
      this.offersServiceSubscription = this.OfferStore.ServiceAccount_UpgradeOffers.subscribe(
        upgradeOffers => {
          this.isLoadingUpgrades = false;
          this.upgradeOffers = upgradeOffers;
          this.upgradeOffersLegalTextArray = this.getUniqueLegalText(this.upgradeOffers);
          console.log('Upgrade offers legal text', this.upgradeOffersLegalTextArray);
          console.log('Upgrade offers', this.upgradeOffers);
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
      this.renewalOffersLegalTextArray = this.getUniqueLegalText(this.renewalOffers);
      console.log('Renewal offers legal text', this.renewalOffersLegalTextArray);
      console.log('Renewal offers', this.renewalOffers);
    }
  }

  getUniqueLegalText(offersArray: IOffers[]): string[] {
    let other = []; // your other array...
    let result: string[];
    offersArray.map(item => {
      return {
        Legal_Text_List: item.Legal_Text_List
      };
    }).forEach(item => item.Legal_Text_List.length > 0 ? other.push(item) : '');
    // console.log('array', other);
    var vals = [];
    for ( var item of other){
      for ( var ite of item.Legal_Text_List) {
        vals.push(ite);
      }
    }
    result = uniq(vals);
     return result;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['promoCode']) {
      this.initialize();
    }
  }

  resetOffers($event: Event) {

    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.promoCode = null;
    this.populateOffers();
  }

  onOfferSelected($event: IOfferSelectionPayLoad) {
    const payload = $event;
    switch (payload.OfferSelectionType) {
      case OfferSelectionType.Renewal: {
        this.createRenewal(payload);
        break;
      }
      case OfferSelectionType.Upgrade: {
        this.createUpgrade(payload);
        break;
      }
      case OfferSelectionType.Moving: {
        this.movingOffer(payload);
        break;
      }
      default: {
        break;
      }
    }
  }

  private createRenewal(offerSelectionPayLoad: IOfferSelectionPayLoad) {

    const request = {} as ICreateRenewalRequest;
    request.Service_Account_Id = offerSelectionPayLoad.Service_Account_Id;
    request.Offering_Name = offerSelectionPayLoad.Offering_Name;
    request.User_Name = offerSelectionPayLoad.User_Name;

    if (offerSelectionPayLoad.Has_Partner) {
      request.Partner_Name_On_Account = offerSelectionPayLoad.Partner_Name_On_Account;
      request.Partner_Account_Number = offerSelectionPayLoad.Partner_Account_Number;
    }

    this.renewalStore.createRenewal(request).subscribe(result => {
      if (result) {
        console.log('done');
        this.planConfirmationModal.showPlanConfirmationModal({
          isRenewalPlan: true,
          customerDetails: this.customerDetails
        });
      }
    }, err => {
      this.errorModal.showErrorModal(err);
    });
  }

  private createUpgrade(offerSelectionPayLoad: IOfferSelectionPayLoad) {

    const request = {} as ICreateUpgradeRequest;
    request.Service_Account_Id = offerSelectionPayLoad.Service_Account_Id;
    request.Offering_Name = offerSelectionPayLoad.Offering_Name;
    request.User_Name = offerSelectionPayLoad.User_Name;

    if (offerSelectionPayLoad.Has_Partner) {
      request.Partner_Name_On_Account = offerSelectionPayLoad.Partner_Name_On_Account;
      request.Partner_Account_Number = offerSelectionPayLoad.Partner_Account_Number;
    }

    this.upgradeStore.createUpgrade(request).subscribe(result => {
      if (result) {
        console.log('done');
        this.planConfirmationModal.showPlanConfirmationModal({
          isRenewalPlan: false,
          customerDetails: this.customerDetails
        });
      }
    }, err => {
      this.errorModal.showErrorModal(err);
    });
  }

  private movingOffer(offerSelectionPayload: IOfferSelectionPayLoad) {
    console.log('payload', offerSelectionPayload);
  }

  ngOnDestroy() {
    if (this.offersServiceSubscription) {
      this.offersServiceSubscription.unsubscribe();
    }
    this.customerAccountServiceSubscription.unsubscribe();
    this.plansServicesSubscription.unsubscribe();
  }
}
