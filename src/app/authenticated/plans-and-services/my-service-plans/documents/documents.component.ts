import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { get, result } from 'lodash';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import {Subscription} from 'rxjs/Subscription';
import {IOffers} from '../../../../core/models/offers/offers.model';
import {AllOffersClass} from '../../../../core/models/offers/alloffers.model';
import {OfferService} from '../../../../core/offer.service';
import {ServiceAccountService} from '../../../../core/serviceaccount.service';
import {MdTooltipModule} from '@angular/material';
import {RenewalService} from '../../../../core/renewal.service';
@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() ActiveServiceAccount: ServiceAccount = null;
  OffersServiceSubscription: Subscription;
  RenewalServiceSubscription: Subscription;
  public AllOffers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;
  IsOffersReady: boolean = null;
  public IsInRenewalTimeFrame: boolean = null;

  constructor(private serviceAccount_service: ServiceAccountService, private RenewalService: RenewalService, private OfferService: OfferService) {
    this.IsInRenewalTimeFrame = null;
    this.RenewalOffers = null;
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ActiveServiceAccount'] && this.ActiveServiceAccount) {
      this.RenewalServiceSubscription = this.RenewalService.getRenewalDetails(Number(this.ActiveServiceAccount.Id)).subscribe(
        RenewalDetails => { this.IsInRenewalTimeFrame = RenewalDetails.Is_Account_Eligible_Renewal;
          if (this.IsInRenewalTimeFrame) {
            this.OffersServiceSubscription = this.OfferService.getRenewalOffers(Number(this.ActiveServiceAccount.Id)).subscribe(
              all_offers => {
                this.FeaturedOffers = all_offers.filter(item => item.Type === 'Featured_Offers');
                this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
              });
          }
        }
      );
    }

  }
  ngOnDestroy() {
    result(this.RenewalServiceSubscription, 'unsubscribe');
    if (this.IsInRenewalTimeFrame) {
      result(this.OffersServiceSubscription, 'unsubscribe');
    }
  }
}
