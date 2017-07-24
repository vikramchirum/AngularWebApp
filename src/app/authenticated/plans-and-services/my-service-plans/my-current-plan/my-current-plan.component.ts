import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { ServicePlanUpgradeModalComponent } from 'app/authenticated/plans-and-services/my-service-plans/change-your-plan/change-your-plan-card/service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
import {OfferService} from '../../../../core/offer.service';
import {AllOffersClass} from '../../../../core/models/offers/alloffers.model';
import {IOffers} from '../../../../core/models/offers/offers.model';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, AfterViewInit, OnDestroy {
  IsInRenewalTimeFrame: boolean;
  billingAccountSubscription: Subscription;
  activebillingAccountOffersSubscription: Subscription;

  public All_Offers: AllOffersClass;
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;

  selectCheckBox  = false;
  enableSelect = false;
  ActiveBillingAccountDetails: BillingAccountClass;
  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;

  constructor(private billingAccount_service: BillingAccountService, private active_billingaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
    this.activebillingAccountOffersSubscription = this.active_billingaccount_service.ActiveBillingAccountOfferObservable.subscribe(
      all_offers => {
        this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
        this.RenewalOffers = (this.FeaturedOffers[0].Offers)[0];

        console.log('Featured_Offers', this.RenewalOffers);
      });
  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
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
