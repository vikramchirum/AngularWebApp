import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { get, result } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IOffers } from '../../../../core/models/offers/offers.model';
import { AllOffersClass } from '../../../../core/models/offers/alloffers.model';
import { OfferService } from '../../../../core/offer.service';
import { DocumentsService } from '../../../../core/documents.service';
import { ServiceAccountService } from '../../../../core/serviceaccount.service';
import { RenewalStore } from '../../../../core/store/RenewalStore';

@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnChanges, OnDestroy {

  renewalStoreSubscription: Subscription;

  @Input() ActiveServiceAccount: ServiceAccount = null;
  activeserviceAccountOffersSubscription: Subscription;

  public eflLink;
  public tosLink;
  public yraacLink;

  OffersServiceSubscription: Subscription;
  public AllOffers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;
  IsOffersReady: boolean = null;
  public IsInRenewalTimeFrame: boolean = null;

  constructor(private serviceAccount_service: ServiceAccountService, private renewalStore: RenewalStore, private OfferService: OfferService, private documentsService: DocumentsService) {
    this.IsInRenewalTimeFrame = null;
    this.RenewalOffers = null;
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ActiveServiceAccount']) {

      if (this.ActiveServiceAccount) {


        this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(
          RenewalDetails => {

            if (RenewalDetails == null) {
              return;
            }

            this.IsInRenewalTimeFrame = RenewalDetails.Is_Account_Eligible_Renewal;
            if (this.IsInRenewalTimeFrame) {
              this.OffersServiceSubscription = this.OfferService.getRenewalOffers(Number(this.ActiveServiceAccount.Id)).subscribe(
                all_offers => {
                  this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
                  this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
                });
            }
          }
        );



        // this.IsInRenewalTimeFrame = this.ActiveServiceAccount.IsUpForRenewal;
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
  }

  ngOnDestroy() {
    this.renewalStoreSubscription.unsubscribe();
    if (this.IsInRenewalTimeFrame) {
      result(this.OffersServiceSubscription, 'unsubscribe');
    }
  }
}
