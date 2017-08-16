import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { get, result } from 'lodash';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import {Subscription} from 'rxjs/Subscription';
import {IOffers} from '../../../../core/models/offers/offers.model';
import {AllOffersClass} from '../../../../core/models/offers/alloffers.model';
import {OfferService} from '../../../../core/offer.service';
import {ServiceAccountService} from '../../../../core/serviceaccount.service';
import {MdTooltipModule} from '@angular/material';
@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  @Input() ActiveServiceAccount: ServiceAccount = null;
  activeserviceAccountOffersSubscription: Subscription;

  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;
  IsOffersReady: boolean = null;
  IsInRenewalTimeFrame: boolean;

  constructor(private serviceAccount_service: ServiceAccountService, private active_serviceaccount_service: OfferService) {
    this.IsInRenewalTimeFrame = false;
    this.RenewalOffers = null;
  }

  ngOnInit() {

    if (this.ActiveServiceAccount) {
      this.IsInRenewalTimeFrame = this.ActiveServiceAccount.IsUpForRenewal;
    }

    this.activeserviceAccountOffersSubscription = this.active_serviceaccount_service.ActiveServiceAccountOfferObservable.subscribe(
      all_offers => {
        this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
        this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
        this.IsOffersReady = true;
        console.log('Featured_Offers', this.RenewalOffers);
      });
  }

  ngOnDestroy() {
    result(this.activeserviceAccountOffersSubscription, 'unsubscribe');
  }
}
