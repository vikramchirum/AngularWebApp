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
  GexaLyricOffer: IOffers;
  IsOnGexaLyric: boolean = null;
  constructor( private ServiceAccountService: ServiceAccountService,
               private OfferStore: OffersStore) { }
  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.OfferStore.LoadLyricOfferDetails(this.ActiveServiceAccount.TDU_DUNS_Number);
        this.offersServiceSubscription = this.OfferStore.GexaLyricOffer.subscribe(
          GexaLyricOffer => {
            this.GexaLyricOffer = GexaLyricOffer[0];
            console.log('Gexa Lyric Offer', this.GexaLyricOffer);
            if (this.ActiveServiceAccount.Current_Offer.Rate_Code === this.GexaLyricOffer.Rate_Code) {
              this.IsOnGexaLyric = true;
            }
          }
        );
      });
      this.promoCode =
        this.GexaLyricOffer ?
          (this.GexaLyricOffer.Promotion ? (this.GexaLyricOffer.Promotion.Code ? this.GexaLyricOffer.Promotion.Code : 'Hello' ) : 'Hello') : 'Hello';
  }
  ngOnDestroy() {
    this.serviceAccountServiceSubscription.unsubscribe();
    this.offersServiceSubscription.unsubscribe();
  }

}
