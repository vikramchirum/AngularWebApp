import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { get, result, includes } from 'lodash';
import * as $ from 'jquery';

import { IUser } from 'app/core/models/user/User.model';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRenewalDetails } from 'app/core/models/renewals/renewaldetails.model';
import { ICreateRenewalRequest } from 'app/core/models/renewals/createrenewalrequest.model';
import { Offer } from 'app/core/models/offers/offer.model';
import { IServiceAccountPlanHistoryOffer } from 'app/core/models/serviceaccount/serviceaccountplanhistoryoffer.model';
import { OfferSelectionType } from 'app/core/models/enums/offerselectiontype';
import { IOfferSelectionPayLoad } from 'app/shared/models/offerselectionpayload';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { UserService } from 'app/core/user.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { UtilityService } from 'app/core/utility.service';
import { RenewalStore } from 'app/core/store/renewalstore';
import { ChannelStore } from 'app/core/store/channelstore';
import { OffersStore } from 'app/core/store/offersstore';

import { PlanConfirmationModalComponent } from '../plan-confirmation-modal/plan-confirmation-modal.component';
import { ErrorModalComponent } from 'app/shared/components/error-modal/error-modal.component';

import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ViewChild('planPopModal') public planPopModal: PlanConfirmationPopoverComponent;
  @ViewChild('errorModal') errorModal: ErrorModalComponent;
  @ViewChild('planConfirmationModal') planConfirmationModal: PlanConfirmationModalComponent;

  private channelId: string;
  user: IUser;
  customerDetails: CustomerAccount;
  ActiveServiceAccount: ServiceAccount;
  public RenewalAccount: IRenewalDetails;
  plansServicesSubscription: Subscription;
  OffersServiceSubscription: Subscription;
  customerAccountServiceSubscription: Subscription;
  isOffersReady: boolean = null;
  public isUpForRenewal: boolean;
  isOfferAgreed = false;
  isOfferSelected = false;
  public isRenewalPending: boolean;
  public isOnHoldOver: boolean;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers = null;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  public Price_atFeatured_Usage_Level_Renewal: number;
  public Price_atFeatured_Usage_Level_Current: number;
  isRenewalPlan: boolean = null;
  // selectCheckBox = false;
  // enableSelect = false;
  currentView: string = null;
  renewalUpgradeFormGroup: FormGroup;
  offerSelectionType = OfferSelectionType;
  offerSelectionPayLoad: IOfferSelectionPayLoad;
  showViewMoreRenewals = false;
  private channelStoreSubscription: Subscription = null;

  constructor(private userService: UserService,
              private serviceAccountService: ServiceAccountService,
              private OfferStore: OffersStore,
              private renewalStore: RenewalStore,
              private channelStore: ChannelStore,
              private utilityService: UtilityService,
              private customerAccountService: CustomerAccountService,
              private googleAnalyticsService: GoogleAnalyticsService,
              private formBuilder: FormBuilder) {
    this.isOffersReady = false;
  }

  ngOnInit() {

    this.userService.UserObservable.subscribe(user => {
      this.user = user;
    });

    this.channelStoreSubscription = this.channelStore.Channel_Id.subscribe(channelId => {
      this.channelId = channelId;
    });

    this.customerAccountServiceSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(result => {
      this.customerDetails = result;
    });

    this.renewalUpgradeFormGroup = this.formBuilder.group({
      accountName: ['', Validators.required],
      rewardsNumber: ['', Validators.required]
    });
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;

    this.plansServicesSubscription = renewalDetails$.withLatestFrom(activeServiceAccount$).subscribe(result => {
      this.ActiveServiceAccount = result[1];
      this.RenewalAccount = result[0];
      this.isOnHoldOver = this.ActiveServiceAccount.Current_Offer.IsHoldOverRate;
      if (result[0] != null) {
        this.ActiveServiceAccount = result[1];
        this.RenewalAccount = result[0];
        console.log('Renewal account', this.RenewalAccount);
        if (result[0] != null) {
          if (this.RenewalAccount.Existing_Renewal) {  this.checkRenewalFeaturedUsageLevel(this.RenewalAccount.Existing_Renewal.Offer); }
          this.isUpForRenewal = result[0].Is_Account_Eligible_Renewal;
          this.isRenewalPending = result[0].Is_Pending_Renewal;
          this.setFlags();
          if (this.isUpForRenewal) {
            this.OffersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
              All_Offers => {
                if (All_Offers != null) {
                  this.FeaturedOffers = All_Offers.filter(item => item.Type === 'Featured_Offers');
                  this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
                  if (this.RenewalOffers) {
                    this.checkFeaturedUsageLevel(this.RenewalOffers);
                  }
                  this.isOffersReady = true;
                }
              });
          }
        }
      }
    });

  }
  showPlan(planType: string) {
    if (planType === 'Renewal') {
      this.isRenewalPlan = true;
    } else {

    }
  }
  ngAfterViewInit() {
    var ele = $('#moreRenewal');
    if (ele) {
      this.showViewMoreRenewals = true;
    } else {
      this.showViewMoreRenewals = false;
    }
  }
  setFlags() {
    if (this.ActiveServiceAccount) {
      if (this.isRenewalPending) {
        this.currentView = 'PendingRenewalPlan';
        if (this.RenewalAccount.Existing_Renewal) {
          this.RenewalAccount.Existing_Renewal.End_Date = this.utilityService.addMonths(new Date(this.RenewalAccount.Existing_Renewal.Start_Date), this.RenewalAccount.Existing_Renewal.Offer.Term);
        }
      } else if (this.isUpForRenewal && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        this.currentView = 'RenewalPlan';
      } else if (this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        this.currentView = 'HoldOverPlan';
      } else if (!this.isUpForRenewal && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        this.currentView = 'CurrentPlan';
      }
    }
  }

  public planPendingViewCurrentPlan() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewCurrentPlan]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewCurrentPlan]);
    this.isRenewalPlan = false;
  }


  checkCurrentFeaturedUsageLevel(CurrentOffer: IServiceAccountPlanHistoryOffer) {
    if (CurrentOffer) {
        this.Featured_Usage_Level = CurrentOffer.Featured_Usage_Level;
        switch (CurrentOffer.Featured_Usage_Level) {
          case  '500 kWh': {
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt500kwh;
            break;
          }
          case  '1000 kWh': {
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt1000kwh;
            break;
          }
          case  '2000 kWh': {
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt2000kwh;
            break;
          }
          default: {
            CurrentOffer.Featured_Usage_Level = '2000 kWh';
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt2000kwh;
            break;
          }
        }
    }
  }

  checkFeaturedUsageLevel(RenewalOffer: IOffers) {
    if (RenewalOffer) {
        switch (RenewalOffer.Plan.Product.Featured_Usage_Level) {
          case  '500 kWh': {
            this.Price_atFeatured_Usage_Level = RenewalOffer.Price_At_500_kwh;
            break;
          }
          case  '1000 kWh': {
            this.Price_atFeatured_Usage_Level = RenewalOffer.Price_At_1000_kwh;
            break;
          }
          case  '2000 kWh': {
            this.Price_atFeatured_Usage_Level = RenewalOffer.Price_At_2000_kwh;
            break;
          }
          default: {
            RenewalOffer.Plan.Product.Featured_Usage_Level = '2000 kWh';
            this.Price_atFeatured_Usage_Level = RenewalOffer.Price_At_2000_kwh;
            break;
          }
        }
    }
  }

  checkRenewalFeaturedUsageLevel(RenewalOffer: Offer) {
    if (RenewalOffer) {
        switch (RenewalOffer.Featured_Usage_Level) {
          case  '500 kWh': {
            this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt500kwh;
            break;
          }
          case  '1000 kWh': {
            this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt1000kwh;
            break;
          }
          case  '2000 kWh': {
            this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt2000kwh;
            break;
          }
          default: {
            RenewalOffer.Featured_Usage_Level = '2000 kWh';
            this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt2000kwh;
            break;
          }
        }
    }
  }

  onSelectOffer(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOfferSelected = true;
    // this.selectCheckBox = true;
  }

  toggleButton() {
    // this.enableSelect = !this.enableSelect;
    this.isOfferAgreed = !this.isOfferAgreed;
  }
  //
  // closeCheckBox() {
  //   this.selectCheckBox = false;
  //   this.enableSelect = false;
  // }
  onCloseSelectOffer(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOfferSelected = false;
    // this.selectCheckBox = false;
    // this.enableSelect = false;
  }

  createRenewal() {

    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.CreateRenewal]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.CreateRenewal]);

    const request = {} as ICreateRenewalRequest;
    request.Service_Account_Id = this.ActiveServiceAccount.Id;
    request.Offering_Id = this.RenewalOffers.Id;
    request.User_Name = 'myGexa/' + this.user.Profile.Username;
    request.Channel_Id = this.channelId;
    request.Current_Rate_Code = this.ActiveServiceAccount.Current_Offer.Rate_Code;

    if (this.RenewalOffers.Has_Partner) {
      request.Partner_Account_Number = this.renewalUpgradeFormGroup.get('accountName').value;
      request.Partner_Name_On_Account = this.renewalUpgradeFormGroup.get('rewardsNumber').value;
    }

    this.renewalStore.createRenewal(request).subscribe(result => {
      if (result) {
        this.planConfirmationModal.showPlanConfirmationModal({
          isRenewalPlan: true,
          customerDetails: this.customerDetails
        });
      }
    }, err => {
      this.errorModal.showErrorModal(err);
    });
  }

  isCreateOfferEnabled() {
    if (this.RenewalOffers.Has_Partner) {
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
    if (this.plansServicesSubscription) {
      this.plansServicesSubscription.unsubscribe();
    }
    if (this.isUpForRenewal) {
      this.OffersServiceSubscription.unsubscribe();
    }
    if (this.customerAccountServiceSubscription) {
      this.customerAccountServiceSubscription.unsubscribe();
    }
    if (this.channelStoreSubscription) {
      this.channelStoreSubscription.unsubscribe();
    }
  }

  onOfferSelected(event) {
    this.offerSelectionPayLoad = event;
    if (this.offerSelectionPayLoad.Has_Partner) {
      this.renewalUpgradeFormGroup.get('accountName').setValue(this.offerSelectionPayLoad.Partner_Account_Number);
      this.renewalUpgradeFormGroup.get('rewardsNumber').setValue(this.offerSelectionPayLoad.Partner_Name_On_Account);
    }
    this.createRenewal();
  }
  scroll2renewalSection() {
    var ele = $('#moreRenewal');
    // console.log(ele.offset().left);
    window.scrollTo({ left: ele.offset().left, top: ele.offset().top, behavior: 'smooth' });
  }
}
