import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { get, result } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { OfferService } from 'app/core/offer.service';
import { AllOffersClass } from 'app/core/models/offers/alloffers.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, AfterViewInit, OnDestroy {
  IsOffersReady: boolean = null;
  IsInRenewalTimeFrame: boolean;
  serviceAccountSubscription: Subscription;
  activeserviceAccountOffersSubscription: Subscription;

  public All_Offers: AllOffersClass;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;

  selectCheckBox  = false;
  enableSelect = false;
  ActiveServiceAccountDetails: ServiceAccount;

  constructor(private serviceAccount_service: ServiceAccountService, private active_serviceaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
    this.RenewalOffers = null;
  }

  ngOnInit() {
    this.serviceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
        this.IsOffersReady = false;
      });
    this.activeserviceAccountOffersSubscription = this.active_serviceaccount_service.ActiveServiceAccountOfferObservable.subscribe(
      all_offers => {
        this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
        this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
        this.IsOffersReady = true;
        console.log('Featured_Offers', this.RenewalOffers);
      });
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    result(this.serviceAccountSubscription, 'unsubscribe');
    result(this.activeserviceAccountOffersSubscription, 'unsubscribe');
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

  getEndDate(startDate): Date {
    startDate = new Date(startDate);
    return new Date(new Date(startDate).setMonth(startDate.getMonth() + 12));
  }

}
