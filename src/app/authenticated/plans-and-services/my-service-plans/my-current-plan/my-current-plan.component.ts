import {
  Component, OnDestroy, OnInit, SimpleChanges, ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { get, result, includes } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { PlanConfirmationPopoverComponent} from '../plan-confirmation-popover/plan-confirmation-popover.component';
import { RenewalStore } from '../../../../core/store/RenewalStore';
import {OffersStore} from '../../../../core/store/OffersStore';
import {Observable} from 'rxjs/Observable';
import {IRenewalDetails} from '../../../../core/models/renewals/renewaldetails.model';
import {ICreateRenewalRequest} from '../../../../core/models/renewals/createrenewalrequest.model';

import {UserService} from '../../../../core/user.service';
import {IUser} from '../../../../core/models/user/User.model';

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
  IsOffersReady: boolean = null;
  public IsUpForRenewal: boolean;
  public IsRenewalPending: boolean;
  public IsOnHoldOver: boolean;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers = null;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  selectCheckBox  = false;
  enableSelect = false;

  constructor(private userService: UserService, private serviceAccountService: ServiceAccountService
    , private OfferStore: OffersStore, private renewalStore: RenewalStore) {
    this.IsOffersReady = false;
  }

  ngOnInit() {

    this.userService.UserObservable.subscribe(res => {
      this.user = res;
    });

    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1].Service_Account_Id).subscribe(result => {
      this.ActiveServiceAccount = result[0];
      this.RenewalAccount = result[1];
      this.IsOnHoldOver = this.ActiveServiceAccount.Current_Offer.IsHoldOverRate;
      if (result[1] != null) {
        this.ActiveServiceAccount = result[0];
        this.RenewalAccount = result[1];
        if (result[1] != null) {
          this.IsUpForRenewal = result[1].Is_Account_Eligible_Renewal;
          this.IsRenewalPending = result[1].Is_Pending_Renewal;
          if (this.IsUpForRenewal) {
            this.OffersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
              All_Offers => {
                if (All_Offers != null) {
                  this.FeaturedOffers = All_Offers.filter(item => item.Type === 'Featured_Offers');
                  this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
                  if (this.RenewalOffers) {
                    this.checkFeaturedUsageLevel(this.RenewalOffers);
                  }
                  this.IsOffersReady = true;
                }
              });
          }
        }
      }
    });
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

  ngOnDestroy() {
    this.plansServicesSubscription.unsubscribe();
    if (this.IsUpForRenewal) {
    result(this.OffersServiceSubscription, 'unsubscribe'); }
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
  showConfirmationPop() {

    // call the renewal service
    const request = {} as ICreateRenewalRequest;
    request.Service_Account_Id = this.ActiveServiceAccount.Id;
    request.Offering_Name = this.RenewalOffers.Rate_Code;
    request.User_Name = this.user.Profile.Username;
    this.renewalStore.createRenewal(request).subscribe(result => {
      if (result) {
        console.log('Renewal Created');
        this.planPopModal.showPlanPopModal();
      }
    });
    this.planPopModal.showPlanPopModal();
  }
}
