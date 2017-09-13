import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap';

import { IOffers} from '../../../../../core/models/offers/offers.model';
import { ServiceAccount } from '../../../../../core/models/serviceaccount/serviceaccount.model';
import { DocumentsService } from '../../../../../core/documents.service';
import {IRenewalDetails} from '../../../../../core/models/renewals/renewaldetails.model';

@Component({
  selector: 'mygexa-offer-details-popover',
  templateUrl: './offer-details-popover.component.html',
  styleUrls: ['./offer-details-popover.component.scss']
})
export class OfferDetailsPopoverComponent implements OnInit, OnChanges {
 @ViewChild('pop') public pop: PopoverDirective;
 @Input() OfferDetails: IOffers;
 @Input() ActiveOfferDetails: ServiceAccount;
 @Input() IsCurrentPlanPopOver: boolean;
 @Input() RenewalAccountDetails: IRenewalDetails;

 public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  public eflLink;
 public tosLink;
 public yraacLink;

  constructor(private documentsService: DocumentsService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['ActiveOfferDetails']) {
      let docId = '';
      if (this.ActiveOfferDetails.Current_Offer.IsLegacyOffer) {
        docId = this.ActiveOfferDetails.Current_Offer.Rate_Code;
      } else {
        docId = this.ActiveOfferDetails.Current_Offer.Client_Key;
      }

      this.eflLink = this.documentsService.getEFLLink(docId);
      this.tosLink = this.documentsService.getTOSLink(this.ActiveOfferDetails.Current_Offer.IsFixed);
      this.yraacLink = this.documentsService.getYRAACLink();

    } else if (changes['OfferDetails']) {

      if (this.OfferDetails) {
        if (this.OfferDetails.Plan.Product.Featured_Usage_Level != null) {
          switch (this.OfferDetails.Plan.Product.Featured_Usage_Level) {
            case  '500 kWh': {
              this.Price_atFeatured_Usage_Level = this.OfferDetails.Price_At_500_kwh;
              break;
            }
            case  '1000 kWh': {
              this.Price_atFeatured_Usage_Level = this.OfferDetails.Price_At_1000_kwh;
              break;
            }
            case  '2000 kWh': {
              this.Price_atFeatured_Usage_Level = this.OfferDetails.Price_At_2000_kwh;
              break;
            }
            default: {
              this.OfferDetails.Plan.Product.Featured_Usage_Level = '2000 kWh';
              this.Price_atFeatured_Usage_Level = this.OfferDetails.Price_At_2000_kwh;
              break;
            }
          }
        }
      }

      this.eflLink = this.documentsService.getEFLLink(this.OfferDetails.Id);
      this.tosLink = this.documentsService.getTOSLink(this.OfferDetails.Plan.Product.Fixed);
      this.yraacLink = this.documentsService.getYRAACLink();

    } else if (changes['RenewalAccountDetails']) {


      if (this.RenewalAccountDetails) {
        console.log('More');
        console.log(this.RenewalAccountDetails.Existing_Renewal.Offer.Client_Key);
        let docId = '';
        if (this.RenewalAccountDetails.Existing_Renewal.Offer.IsLegacyOffer) {
          docId = this.RenewalAccountDetails.Existing_Renewal.Offer.Rate_Code;
        } else {
          docId = this.RenewalAccountDetails.Existing_Renewal.Offer.Client_Key;
        }

        this.eflLink = this.documentsService.getEFLLink(docId);
        this.tosLink = this.documentsService.getTOSLink(this.RenewalAccountDetails.Existing_Renewal.Offer.IsFixed);
        this.yraacLink = this.documentsService.getYRAACLink();
      }
    }
  }
}
