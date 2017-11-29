import { Component, OnInit, Input, ViewContainerRef, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule} from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { ModalDirective } from 'ngx-bootstrap';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IUser } from 'app/core/models/user/User.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { OfferSelectionType } from 'app/core/models/enums/offerselectiontype';
import { IOfferSelectionPayLoad } from '../../models/offerselectionpayload';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { UserService } from 'app/core/user.service';
import { ModalStore } from 'app/core/store/modalstore';

import * as $ from 'jquery';

@Component({
  selector: 'mygexa-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.scss']
})
export class PlayCardComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('pop') public pop: ModalDirective;
    @Input('offer') offer: IOffers;
    @Input('offerSelectionType') offerSelectionType: OfferSelectionType;
    @Output() public onOfferSelectedEvent: EventEmitter<IOfferSelectionPayLoad> = new EventEmitter();
    isMoving: boolean = null;
    renewalUpgradeFormGroup: FormGroup;

    activeServiceAccountDetails: ServiceAccount = null;
    user: IUser;

    priceAtFeaturedUsageLevel: number;
    isOfferSelected = false;
    isOfferAgreed = false;
    productFeaturesSelected = false;
    userServiceSubscription: Subscription;
    activeServiceAccountSubscription: Subscription;
    handleOfferPopOversModalSubscription: Subscription;

    offerPassed: string;

    constructor(private userService: UserService,
                private serviceAccount_service: ServiceAccountService,
                private modalStore: ModalStore,
                private formBuilder: FormBuilder,
                private viewContainerRef: ViewContainerRef) {
      this.isMoving = false;
    }

    ngOnInit() {
      if (this.offerSelectionType === OfferSelectionType.Moving) {
        this.isMoving = true;
      }

      this.renewalUpgradeFormGroup = this.formBuilder.group({
        accountName: ['', Validators.required],
        rewardsNumber: ['', Validators.required]
      });

      this.userServiceSubscription = this.userService.UserObservable.subscribe(result => {
        this.user = result;
      });

      this.activeServiceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null)
        .subscribe(result => {
          this.activeServiceAccountDetails = result;
        });
    }

    ngAfterViewInit() {
      this.handleOfferPopOversModalSubscription = this.modalStore.HandleOfferPopOversModal.subscribe(rateCode => {
        if (this.offer) {
          if (this.offer.Rate_Code !== rateCode) {
            if (this.pop) {
              this.pop.hide();
            }
            this.isOfferSelected = false;
          }
        }
      });
    }

    checkFeaturedUsageLevel(offer: IOffers) {
      const renewalOfferFeaturedUsageLevel = offer.Plan.Product.Featured_Usage_Level;
      if (renewalOfferFeaturedUsageLevel) {
        switch (renewalOfferFeaturedUsageLevel) {
          case  '500 kWh': {
            this.priceAtFeaturedUsageLevel = offer.Price_At_500_kwh;
            break;
          }
          case  '1000 kWh': {
            this.priceAtFeaturedUsageLevel = offer.Price_At_1000_kwh;
            break;
          }
          case  '2000 kWh': {
            this.priceAtFeaturedUsageLevel = offer.Price_At_2000_kwh;
            break;
          }
          default: {
            this.priceAtFeaturedUsageLevel = offer.Price_At_2000_kwh;
            break;
          }
        }
      }
    }

    onProductFeaturesSelected() {
      this.productFeaturesSelected = !this.productFeaturesSelected;
    }

    onSelectOffer(event) {
      event.preventDefault();
      event.stopPropagation();
      this.isOfferSelected = true;
      // this.modalStore.handleOfferPopOversModal(this.offer.Rate_Code);
      $('#planSelect_confirm_' + this.offer.Id).toggleClass('reveal');
      if (this.isMoving) { $('#plan_' + this.offer.Id).removeClass('plan-background'); };
    }

    toggleButton() {

      var offerCheckbox = $('input[name="isOfferAgreedBox"]');

      $(offerCheckbox).on('change', function () {
        $(offerCheckbox).not(this).prop('checked', false);
        $(offerCheckbox).not(this).closest('.planSelect_confirm').find('.btn-final').attr('disabled', 'disabled');

      });

      this.isOfferAgreed = !this.isOfferAgreed;

    }

    onCloseSelectOffer(event) {
      event.preventDefault();
      event.stopPropagation();
      this.isOfferSelected = false;
      $('#planSelect_confirm_' + this.offer.Id).toggleClass('reveal');
      if (this.isMoving) { $('#plan_' + this.offer.Id).addClass('plan-background'); };
      // $('.planSelect_confirm').toggleClass('reveal');
    }

    selectOffer() {
      const offerSelectionPayLoad = {} as IOfferSelectionPayLoad;
      offerSelectionPayLoad.Service_Account_Id = this.activeServiceAccountDetails.Id;
      offerSelectionPayLoad.Offer = this.offer;
      offerSelectionPayLoad.User_Name = this.user.Profile.Username;
      if (this.offer.Has_Partner) {
        offerSelectionPayLoad.Partner_Account_Number = this.renewalUpgradeFormGroup.get('accountName').value;
        offerSelectionPayLoad.Partner_Name_On_Account = this.renewalUpgradeFormGroup.get('rewardsNumber').value;
      }
      offerSelectionPayLoad.OfferSelectionType = this.offerSelectionType;
      this.onOfferSelectedEvent.emit(offerSelectionPayLoad);
    }

    openOfferDetailsPopOver() {
      this.modalStore.handleOfferPopOversModal(this.offer.Rate_Code);
      this.pop.show();
    }

    isCreateOfferEnabled() {
      if (this.offer.Has_Partner) {
        if (!this.isOfferAgreed) {
          return true;
        }
        if (!this.renewalUpgradeFormGroup.valid) {
          return true;
        }
      } else if (!this.isOfferAgreed) {
        return true;
      }
    }

    ngOnDestroy() {
      this.userServiceSubscription.unsubscribe();
      this.activeServiceAccountSubscription.unsubscribe();
      this.handleOfferPopOversModalSubscription.unsubscribe();
    }

  applyFlip() {
    $('#plan_' + this.offer.Id).toggleClass('applyflip');
    if (this.isMoving) { $('#plan_' + this.offer.Id).removeClass('plan-background'); };
    // $('.btn-select').removeClass('disabled');
    /* var $myPlan = $(this).parents('.plan');console.log($myPlan);
    $myPlan.toggleClass('applyflip');
    $myPlan.find('.btn-select').removeClass('disabled'); */
  }
   revertToPlan(event) {
    this.offerPassed = event;
    if (event.indexOf('#') > 0) {
      this.offerPassed = event.substr(0, (event.length - 1));
      if (this.isMoving) { $('#plan_' + this.offer.Id).addClass('plan-background'); };
      $('#plan_' + this.offerPassed).toggleClass('applyflip');
    } else {
      $('#plan_' + this.offerPassed).toggleClass('applyflip');
      if (this.isMoving) { $('#plan_' + this.offer.Id).removeClass('plan-background'); };
      this.isOfferSelected = true;
      $('#planSelect_confirm_' + this.offer.Id).toggleClass('reveal');
    }
  }

  btnSubmit() {
      this.selectOffer();
      console.log('select offer called on button click');
    $('#planSelect_confirm_' + this.offer.Id).toggleClass('reveal');
    $('#plan_' + this.offer.Id).removeClass('applyflip');
    // $('.planConfirm').show();
    // $('.btn-select').addClass('disabled');
  }
}
