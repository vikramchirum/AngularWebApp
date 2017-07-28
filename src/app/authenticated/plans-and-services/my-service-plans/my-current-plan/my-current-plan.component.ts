import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { ServicePlanUpgradeModalComponent } from 'app/authenticated/plans-and-services/my-service-plans/change-your-plan/change-your-plan-card/service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {Subscription} from 'rxjs/Subscription';

import {OfferService} from '../../../../core/offer.service';
import {AllOffersClass} from '../../../../core/models/offers/alloffers.model';
import {IOffers} from '../../../../core/models/offers/offers.model';
import {ServiceAccount} from '../../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, AfterViewInit, OnDestroy {
  IsInRenewalTimeFrame: boolean;
  serviceAccountSubscription: Subscription;
  activeserviceAccountOffersSubscription: Subscription;

  public All_Offers: AllOffersClass;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;

  selectCheckBox  = false;
  enableSelect = false;
  ActiveServiceAccountDetails: ServiceAccount;
  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;

  constructor(private serviceAccount_service: ServiceAccountService, private active_serviceaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {
    this.serviceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
    this.activeserviceAccountOffersSubscription = this.active_serviceaccount_service.ActiveServiceAccountOfferObservable.subscribe(
      all_offers => {
        this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
        this.RenewalOffers = (this.FeaturedOffers[0].Offers)[0];

        console.log('Featured_Offers', this.RenewalOffers);
      });
  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.serviceAccountSubscription.unsubscribe();
  }
  showServiceUpgradeModal() {
    this.serviceUpgradeModal.show();

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
