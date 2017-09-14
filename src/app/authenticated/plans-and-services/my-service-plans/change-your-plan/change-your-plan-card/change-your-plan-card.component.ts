import {
  Component, OnInit, ViewChild, OnDestroy, ViewContainerRef
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

import { UserService } from 'app/core/user.service';
import { IUser } from 'app/core/models/user/User.model';

import {OfferDetailsPopoverComponent} from '../offer-details-popover/offer-details-popover.component';
import { PlanConfirmationPopoverComponent } from '../../plan-confirmation-popover/plan-confirmation-popover.component';

import { IOffers } from 'app/core/models/offers/offers.model';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';

import { RenewalStore } from 'app/core/store/RenewalStore';
import { OffersStore } from 'app/core/store/OffersStore';

import { IRenewalDetails } from 'app/core/models/renewals/renewaldetails.model';
import { ICreateRenewalRequest } from 'app/core/models/renewals/createrenewalrequest.model';

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy {

  @ViewChild('planPopModal') public planPopModal: PlanConfirmationPopoverComponent;

  plansServicesSubscription: Subscription;
  OffersServiceSubscription: Subscription;
  userServiceSubscription: Subscription;

  user: IUser;
  ActiveServiceAccountDetails: ServiceAccount = null;
  Renewaldetails: IRenewalDetails = null;

  selectCheckBox: boolean[] = [];
  enableSelect: boolean[] = [];
  chev_clicked: boolean[] = [];

  IsInRenewalTimeFrame: boolean;   IsRenewalPending: boolean; IsOnHoldOver: boolean;
  public AllOffers: AllOffersClass[];
  public All_Offers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public BestRenewalOffer: IOffers;
  public UpgradeOffers: IOffers[];
  public AllOfferss: IOffers[];
  public upgradeOffersArraylength: number = null;
  public renewalOffersArraylength: number = null;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  selectedIndex: number; length: number;

  constructor(
    private userService: UserService,
    private serviceAccount_service: ServiceAccountService,
    private OfferStore: OffersStore,
    private renewalStore: RenewalStore,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {

   this.userServiceSubscription =  this.userService.UserObservable.subscribe(res => {
      this.user = res;
    });

    const activeServiceAccount$ = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;

    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1]).subscribe(result => {

      this.ActiveServiceAccountDetails = result[0];
      this.Renewaldetails = result[1];

      this.IsOnHoldOver = this.ActiveServiceAccountDetails.Current_Offer.IsHoldOverRate;
      console.log('Renewal details', this.Renewaldetails);
      this.IsInRenewalTimeFrame = result[1].Is_Account_Eligible_Renewal; this.IsRenewalPending = result[1].Is_Pending_Renewal;

      if (this.IsInRenewalTimeFrame && !this.IsRenewalPending && !result[0].Current_Offer.IsHoldOverRate) {
        this.OffersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
          All_Offers => {
            if (All_Offers != null) {
              // console.log('All offers', All_Offers);
              this.extractOffers(All_Offers);
            }
            return All_Offers;
          }
        );
      } else if (!this.IsInRenewalTimeFrame || result[0].Current_Offer.IsHoldOverRate || this.IsRenewalPending) {
        this.OffersServiceSubscription = this.OfferStore.ServiceAccount_UpgradeOffers.subscribe(
          Upgrade_Offers => {
            this.UpgradeOffers = Upgrade_Offers;
             console.log('Upgrade Offers', this.UpgradeOffers);
            if (this.UpgradeOffers) {
              this.upgradeOffersArraylength = Upgrade_Offers.length;
            }
            return this.UpgradeOffers;
          }
        );
      }
    });
  }

  featuredOfferFeatures(offer: IOffers) {
    this.length = offer.Plan.Product.Product_Features ? offer.Plan.Product.Product_Features.length : 0;
  }

  checkFeaturedUsageLevel(RenewalOffer_FeaturedUsageLevel: string, RenewalOffer: IOffers) {
      if (RenewalOffer_FeaturedUsageLevel != null) {
        switch (RenewalOffer_FeaturedUsageLevel) {
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
            // RenewalOffer.Plan.Product.Featured_Usage_Level = '2000 kWh';
            this.Price_atFeatured_Usage_Level = RenewalOffer.Price_At_2000_kwh;
            break;
          }
        }
      }}

  extractOffers(All_Offers: AllOffersClass[]) {
    this.FeaturedOffers = All_Offers.filter(item => item.Type === 'Featured_Offers');
    if ( this.FeaturedOffers[0].Offers.length > 0) {
      console.log('All_Featured_Offers', this.FeaturedOffers);
      this.BestRenewalOffer = this.FeaturedOffers[0].Offers[0];
      console.log('Best_Featured_Offer', this.BestRenewalOffer);
    }
    this.AllOffers = All_Offers.filter(item => item.Type === 'All_Offers');
    if (this.AllOffers[0].Offers.length > 0) {
      this.AllOfferss = this.AllOffers[0].Offers;
      this.renewalOffersArraylength = this.AllOfferss.length;
      console.log('Rest_All_Offers', this.AllOffers);
    }
  }

  setDefaultValues(index: number) {
    this.selectCheckBox[index] = false;
    this.enableSelect[index] = false;
  }

  onSelect(event, index: number) {
    event.preventDefault();
    this.selectCheckBox[index] = true;
  }

  toggleButton(index: number) {
    this.enableSelect[index] = !this.enableSelect[index];
  }

  closeCheckBox(index: number) {
    this.selectCheckBox[index] = false;
    this.enableSelect[index] = false;
  }


  ChevClicked(index: number) {
    this.selectedIndex = index;
    console.log('Index', this.selectedIndex);
    this.chev_clicked[index] = !this.chev_clicked[index];
  }

  createRenewal(index: number, offer: IOffers){
    const request = {} as ICreateRenewalRequest;
    request.Service_Account_Id = this.ActiveServiceAccountDetails.Id;
    request.Offering_Name = offer.Rate_Code;
    request.User_Name = this.user.Profile.Username;
    this.renewalStore.createRenewal(request).subscribe(result => {
      if (result) {
        console.log('Renewal Created');
        this.showConfirmationPop();
      }
    });
  }

  showConfirmationPop() {
    this.planPopModal.showPlanPopModal();
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.plansServicesSubscription.unsubscribe();
    this.OffersServiceSubscription.unsubscribe();
  }
}
