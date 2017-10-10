import { Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { get, result, includes } from 'lodash';

import { UserService } from 'app/core/user.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { UtilityService } from 'app/core/utility.service';
import { RenewalStore } from 'app/core/store/renewalstore';
import { OffersStore } from 'app/core/store/offersstore';

import { IUser } from 'app/core/models/user/User.model';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRenewalDetails } from 'app/core/models/renewals/renewaldetails.model';
import { ICreateRenewalRequest } from 'app/core/models/renewals/createrenewalrequest.model';

import { PlanConfirmationPopoverComponent } from '../plan-confirmation-popover/plan-confirmation-popover.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, OnDestroy {
  @ViewChild('planPopModal') public planPopModal: PlanConfirmationPopoverComponent;

  user: IUser;
  ActiveServiceAccount: ServiceAccount;
  public RenewalAccount: IRenewalDetails;
  plansServicesSubscription: Subscription;
  OffersServiceSubscription: Subscription;
  isOffersReady: boolean = null;
  public isUpForRenewal: boolean;
  public isRenewalPending: boolean;
  public isOnHoldOver: boolean;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers = null;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  selectCheckBox = false;
  enableSelect = false;
  currentView: string = null;
  renewalUpgradeFormGroup: FormGroup;

  constructor(private userService: UserService, private serviceAccountService: ServiceAccountService
    , private OfferStore: OffersStore, private renewalStore: RenewalStore, private utilityService: UtilityService,
              private formBuilder: FormBuilder) {
    this.isOffersReady = false;
  }

  ngOnInit() {

    this.userService.UserObservable.subscribe(user => {
      this.user = user;
    });

    this.renewalUpgradeFormGroup = this.formBuilder.group({
      accountName: ['', Validators.required],
      rewardsNumber: ['', Validators.required]
    });

    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;

    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1]).subscribe(result => {
      this.ActiveServiceAccount = result[0];
      this.RenewalAccount = result[1];
      this.isOnHoldOver = this.ActiveServiceAccount.Current_Offer.IsHoldOverRate;
      if (result[1] != null) {
        this.ActiveServiceAccount = result[0];
        this.RenewalAccount = result[1];
        if (result[1] != null) {
          this.isUpForRenewal = result[1].Is_Account_Eligible_Renewal;
          this.isRenewalPending = result[1].Is_Pending_Renewal;
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

  setFlags() {
    if (this.ActiveServiceAccount) {
      if (this.isRenewalPending) {
        this.currentView = 'PendingRenewalPlan';
        this.RenewalAccount.Existing_Renewal.End_Date = this.utilityService.addMonths(new Date(this.RenewalAccount.Existing_Renewal.Start_Date), this.RenewalAccount.Existing_Renewal.Offer.Term);
      } else if (this.isUpForRenewal && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        this.currentView = 'RenewalPlan';
      } else if (this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        this.currentView = 'HoldOverPlan';
      } else if (!this.isUpForRenewal && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate) {
        this.currentView = 'CurrentPlan';
      }
    }
  }

  checkFeaturedUsageLevel(RenewalOffer: IOffers) {
    if (RenewalOffer) {
      if (RenewalOffer.Plan.Product.Featured_Usage_Level != null) {
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
  }

  onSelect(event) {
    event.preventDefault();
    this.selectCheckBox = true;
  }

  toggleButton() {
    this.enableSelect = !this.enableSelect;
  }

  closeCheckBox() {
    this.selectCheckBox = false;
    this.enableSelect = false;
  }

  createRenewal() {
    const request = {} as ICreateRenewalRequest;
    request.Service_Account_Id = this.ActiveServiceAccount.Id;
    request.Offering_Name = this.RenewalOffers.Rate_Code;
    request.User_Name = this.user.Profile.Username;
    if (this.RenewalOffers.Has_Partner) {
      request.Partner_Account_Number = this.renewalUpgradeFormGroup.get('accountName').value;
      request.Partner_Name_On_Account = this.renewalUpgradeFormGroup.get('rewardsNumber').value;
    }
    this.renewalStore.createRenewal(request).subscribe(result => {
      if (result) {
        console.log('Renewal Created');
        this.planPopModal.showPlanPopModal();
      }
    });
  }

  ngOnDestroy() {
    this.plansServicesSubscription.unsubscribe();
    if (this.isUpForRenewal) {
      this.OffersServiceSubscription.unsubscribe();
    }
  }
}
