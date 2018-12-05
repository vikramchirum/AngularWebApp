import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap';

import { IOffers} from 'app/core/models/offers/offers.model';
import { ServiceAccount} from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRenewalDetails} from 'app/core/models/renewals/renewaldetails.model';
import { IServiceAccountPlanHistoryOffer } from 'app/core/models/serviceaccount/serviceaccountplanhistoryoffer.model';
import { Offer } from 'app/core/models/offers/offer.model';
import { DocumentsService} from 'app/core/documents.service';
import { environment } from 'environments/environment';

import {GoogleAnalyticsService} from 'app/core/googleanalytics.service';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { ICostComponent } from '../../../core/models/serviceaccount/costcomponent.model';

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
  @Output() public revertBackEvent: EventEmitter<string> = new EventEmitter();

  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  public Price_atFeatured_Usage_Level_Renewal: number;
  public Price_atFeatured_Usage_Level_Current: number;
  public eflLink;
  public tosLink;
  public yraacLink;
  kWhAmountFormatter: string;
  dollarAmountFormatter: string;

  constructor(private documentsService: DocumentsService, private googleAnalyticsService: GoogleAnalyticsService) {
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

      console.log("ActiveOfferDetails", this.ActiveOfferDetails);

      this.eflLink = this.documentsService.getEFLLink(docId);
      this.tosLink = this.documentsService.getTOSLinkWithFeeId(this.ActiveOfferDetails.Current_Offer.IsFixed, this.ActiveOfferDetails.Tos_Fee_Id);
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

  revertBack(flag) {
    this.revertBackEvent.emit(this.OfferDetails.Id + flag);
  }

  public viewEFL(isRenewed: boolean = false, rateCode: string= null) {

    if (isRenewed === null) {
      const eventLabel = GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewEFL] + '-' +  rateCode;
      this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], eventLabel,
      rateCode);
    } else if (!isRenewed) {
      this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewCurrentPlanEFL]
        , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewCurrentPlanEFL]);
    } else if (isRenewed) {
      this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewRenewedPlanEFL]
        , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewRenewedPlanEFL]);
    }
    return true;
  }

  public viewYraac() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewYRAAC]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewYRAAC]);
    return true;
  }

  public viewTos() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MyServicePlan], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewTOS]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ViewTOS]);
    return true;
  }

  determineCostComponentType(costComponent: ICostComponent): string {
    if (costComponent.Amount >= 0 && costComponent.TimeOfUseInterval)
      return "Energy Charges";
    if (costComponent.Amount > 0 && costComponent.Operation_Type == "Multiplicative" && costComponent.IsCompound == true)
      return "Energy Charges";
    else if (costComponent.Amount > 0 && costComponent.Operation_Type == "Additive" && costComponent.IsCompound == true)
      return "Energy Charges";
    else if (costComponent.Amount > 0 && costComponent.Operation_Type == "Multiplicative" && costComponent.IsCompound == false)
      return "Energy Charges";
    else if (costComponent.Amount > 0 && costComponent.Operation_Type == "Additive" && costComponent.IsCompound == false)
      return "Monthly Usage Charges";
    else if (costComponent.Amount < 0 && costComponent.Operation_Type == "Additive" && costComponent.IsCompound == true)
      return "Monthly Usage Credits";
    else if (costComponent.Amount < 0 && costComponent.Operation_Type == "Additive" && costComponent.IsCompound == false)
      return "Monthly Usage Credits";
    else if (costComponent.Amount < 0 && costComponent.Operation_Type == "Multiplicative" && costComponent.IsCompound == true)
      return "Placeholder #1";
    else if (costComponent.Amount < 0 && costComponent.Operation_Type == "Multiplicative" && costComponent.IsCompound == false)
      return "Placeholder #2";
    else
      return "Unknown";
  }
}
