import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { get, result } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IOffers } from '../../../../core/models/offers/offers.model';
import { AllOffersClass } from '../../../../core/models/offers/alloffers.model';
import { OfferService } from '../../../../core/offer.service';
import { DocumentsService } from '../../../../core/documents.service';

@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() ActiveServiceAccount: ServiceAccount = null;
  activeserviceAccountOffersSubscription: Subscription;

  public eflLink;
  public tosLink;
  public yraacLink;

  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;
  IsOffersReady: boolean = null;
  IsInRenewalTimeFrame: boolean;

  constructor(private active_serviceaccount_service: OfferService, private documentsService: DocumentsService) {
    this.IsInRenewalTimeFrame = false;
    this.RenewalOffers = null;
  }

  ngOnInit() {

    this.activeserviceAccountOffersSubscription = this.active_serviceaccount_service.ActiveServiceAccountOfferObservable.subscribe(
      all_offers => {
        this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
        this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
        this.IsOffersReady = true;
        console.log('Featured_Offers', this.RenewalOffers);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ActiveServiceAccount']) {

      if (this.ActiveServiceAccount) {
        this.IsInRenewalTimeFrame = this.ActiveServiceAccount.IsUpForRenewal;
      }

      let docId = '';
      if (this.ActiveServiceAccount.Current_Offer.IsLegacyOffer) {
        docId = this.ActiveServiceAccount.Current_Offer.Rate_Code;
      } else {
        docId = this.ActiveServiceAccount.Current_Offer.Client_Key;
      }

      this.eflLink = this.documentsService.getEFLLink(docId);
      this.tosLink = this.documentsService.getTOSLink(this.ActiveServiceAccount.Current_Offer.IsFixed);
      this.yraacLink = this.documentsService.getYRAACLink();
    }
  }

  ngOnDestroy() {
    result(this.activeserviceAccountOffersSubscription, 'unsubscribe');
  }
}
