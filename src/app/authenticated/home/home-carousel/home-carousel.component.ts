import {Component, OnDestroy, OnInit} from '@angular/core';
import { OffersStore } from '../../../core/store/offersstore';
import { ServiceAccountService } from '../../../core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from '../../../core/models/serviceaccount/serviceaccount.model';
import { IOffers } from '../../../core/models/offers/offers.model';

@Component({
  selector: 'mygexa-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.scss']
})
export class HomeCarouselComponent implements OnInit, OnDestroy {
  serviceAccountServiceSubscription: Subscription = null;
  offersServiceSubscription: Subscription = null;
  public promoCode: string = null;
  ActiveServiceAccount: ServiceAccount = null;
  GexaCarouselOffer: IOffers;
  IsOnGexaLyric: boolean = null;
  IsPaperless: boolean = null;
  constructor( private ServiceAccountService: ServiceAccountService,
               private OfferStore: OffersStore) { }
  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.OfferStore.LoadLyricOfferDetails(this.ActiveServiceAccount.TDU_DUNS_Number);
        this.offersServiceSubscription = this.OfferStore.GexaLyricOffer.subscribe(
          GexaOffer => {
            if (!GexaOffer) {
              return;
            }
            this.GexaCarouselOffer = GexaOffer[0];
            this.promoCode =
              GexaOffer[0] ?
                (GexaOffer[0].Promotion ? (GexaOffer[0].Promotion.Code ? GexaOffer[0].Promotion.Code : null ) : null) : null;
            if (GexaOffer[0] && this.ActiveServiceAccount.Current_Offer.Rate_Code === GexaOffer[0].Rate_Code) {
              this.IsOnGexaLyric = true; this.IsPaperless = this.ActiveServiceAccount.Paperless_Billing;
            }
          }
        );
      });
  }

  ngOnDestroy() {
    this.serviceAccountServiceSubscription.unsubscribe();
    if (this.offersServiceSubscription) {
      this.offersServiceSubscription.unsubscribe();
    }
  }
}
