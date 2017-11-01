import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap';

import { IOffers} from 'app/core/models/offers/offers.model';
import { ServiceAccount} from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRenewalDetails} from 'app/core/models/renewals/renewaldetails.model';
import { DocumentsService} from 'app/core/documents.service';
import { IServiceAccountPlanHistoryOffer } from '../../../core/models/serviceaccount/serviceaccountplanhistoryoffer.model';
import { Offer } from '../../../core/models/offers/offer.model';
import { environment } from 'environments/environment';

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
  public Price_atFeatured_Usage_Level_Renewal: number;
  public Price_atFeatured_Usage_Level_Current: number;
  public eflLink;
  public tosLink;
  public yraacLink;
  kWhAmountFormatter: string;
  dollarAmountFormatter: string;

  constructor(private documentsService: DocumentsService) {
  }

  ngOnInit() {
    this.kWhAmountFormatter = environment.kWhAmountFormatter;
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    if (this.ActiveOfferDetails) {
      this.checkCurrentFeaturedUsageLevel(this.ActiveOfferDetails.Current_Offer);
    } else if (this.RenewalAccountDetails) {
      this.checkRenewalFeaturedUsageLevel(this.RenewalAccountDetails.Existing_Renewal.Offer);
    }
  }

  checkCurrentFeaturedUsageLevel(CurrentOffer: IServiceAccountPlanHistoryOffer) {
    if (CurrentOffer) {
      this.Featured_Usage_Level = CurrentOffer.Featured_Usage_Level;
      switch (CurrentOffer.Featured_Usage_Level) {
        case  '500 kWh': {
          this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt500kwh;
          break;
        }
        case  '1000 kWh': {
          this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt1000kwh;
          break;
        }
        case  '2000 kWh': {
          this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt2000kwh;
          break;
        }
        default: {
          CurrentOffer.Featured_Usage_Level = '2000 kWh';
          this.Featured_Usage_Level = '2000 kWh';
          this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt2000kwh;
          break;
        }
      }
    }
  }

  checkFeaturedUsageLevel(RenewalOffer: IOffers) {
    if (RenewalOffer) {
      this.Featured_Usage_Level = RenewalOffer.Plan.Product.Featured_Usage_Level;
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
          this.Featured_Usage_Level = '2000 kWh';
          this.Price_atFeatured_Usage_Level = RenewalOffer.Price_At_2000_kwh;
          break;
        }
      }
    }
  }

  checkRenewalFeaturedUsageLevel(RenewalOffer: Offer) {
    if (RenewalOffer) {
      this.Featured_Usage_Level = RenewalOffer.Featured_Usage_Level;
      switch (RenewalOffer.Featured_Usage_Level) {
        case  '500 kWh': {
          this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt500kwh;
          break;
        }
        case  '1000 kWh': {
          this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt1000kwh;
          break;
        }
        case  '2000 kWh': {
          this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt2000kwh;
          break;
        }
        default: {
          RenewalOffer.Featured_Usage_Level = '2000 kWh';
          this.Price_atFeatured_Usage_Level_Renewal = RenewalOffer.RateAt2000kwh;
          break;
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['ActiveOfferDetails']) {
      this.checkCurrentFeaturedUsageLevel(this.ActiveOfferDetails.Current_Offer);
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

      this.eflLink = this.documentsService.getEFLLink(this.OfferDetails.Id);
      this.tosLink = this.documentsService.getTOSLink(this.OfferDetails.Plan.Product.Fixed);
      this.yraacLink = this.documentsService.getYRAACLink();

    } else if (changes['RenewalAccountDetails']) {

      if (this.RenewalAccountDetails) {
        this.checkRenewalFeaturedUsageLevel(this.RenewalAccountDetails.Existing_Renewal.Offer);
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
