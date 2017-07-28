import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {Subscription} from 'rxjs/Subscription';
import {OfferService} from '../../core/offer.service';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy, AfterViewInit {

  IsInRenewalTimeFrame: boolean;
  serviceAccountSubscription: Subscription;
  activeserviceAccountOffersSubscription: Subscription;
  constructor(private serviceAccount_service: ServiceAccountService, private active_serviceaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.serviceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
        console.log('IsInRenewalTimeFrame', this.IsInRenewalTimeFrame);
        this.activeserviceAccountOffersSubscription = this.active_serviceaccount_service.ActiveServiceAccountOfferObservable.subscribe(
          all_offers => {
          });
      });
  }

  ngOnDestroy() {
    this.serviceAccountSubscription.unsubscribe();
    this.activeserviceAccountOffersSubscription.unsubscribe();
  }
}
