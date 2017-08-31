import {
  AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild,
  ViewContainerRef
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { get, result, includes } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import {PlanConfirmationPopoverComponent} from '../plan-confirmation-popover/plan-confirmation-popover.component';
import {RenewalService} from '../../../../core/renewal.service';
import {IRenewalDetails} from '../../../../core/models/renewals/renewaldetails.model';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  IsOffersReady: boolean = null;
  OffersServiceSubscription: Subscription;
  RenewalServiceSubscription;
  public IsUpForRenewal: boolean;
  public IsRenewalPending: boolean;
  public All_Offers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers = null;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  selectCheckBox  = false;
  enableSelect = false;
  @Input() ActiveServiceAccount: ServiceAccount;
  public RenewalAccount: IRenewalDetails;
  @ViewChild('planPopModal') public planPopModal: PlanConfirmationPopoverComponent;

  constructor(private Serviceaccount: ServiceAccountService, private OfferService: OfferService, private RenewalService: RenewalService) {
    this.IsOffersReady = false;
  }

  ngOnInit() {

  }

  ngOnChanges(changes:  SimpleChanges) {

    if (changes['ActiveServiceAccount'] && this.ActiveServiceAccount) {
    this.RenewalServiceSubscription = this.RenewalService.getRenewalDetails(Number(this.ActiveServiceAccount.Id)).subscribe(
      RenewalDetails => { this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
      this.IsRenewalPending = RenewalDetails.Is_Pending_Renewal;
        if (this.IsUpForRenewal && !this.IsRenewalPending) {
          this.OffersServiceSubscription = this.OfferService.getRenewalOffers(Number(this.ActiveServiceAccount.Id)).subscribe(
            all_offers => {
              this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
              this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
              this.checkFeaturedUsageLevel(this.RenewalOffers);
              this.IsOffersReady = true;
            });
        } else if ( this.IsRenewalPending) {
          this.RenewalAccount = RenewalDetails;
        } });
    }
  }

  ngAfterViewInit() { }

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
    result(this.RenewalServiceSubscription, 'unsubscribe');
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
    this.planPopModal.showPlanPopModal();
  }

}
