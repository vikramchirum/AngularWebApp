import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {OfferService} from '../../core/offer.service';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy, AfterViewInit {

  IsInRenewalTimeFrame: boolean;
  billingAccountSubscription: Subscription;
  activebillingAccountOffersSubscription: Subscription;
  constructor(private billingAccount_service: BillingAccountService, private active_billingaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
        console.log('IsInRenewalTimeFrame', this.IsInRenewalTimeFrame);
        this.activebillingAccountOffersSubscription = this.active_billingaccount_service.ActiveBillingAccountOfferObservable.subscribe(
          all_offers => {
          });
      });
  }

  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
    this.activebillingAccountOffersSubscription.unsubscribe();
  }
}
