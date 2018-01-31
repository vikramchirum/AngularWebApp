import {Component, OnDestroy, OnInit} from '@angular/core';
import { OffersStore } from '../../../core/store/offersstore';
import { ServiceAccountService } from '../../../core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from '../../../core/models/serviceaccount/serviceaccount.model';
import { IOffers } from '../../../core/models/offers/offers.model';
import { NotificationOptionsStore } from '../../../core/store/notificationoptionsstore';
import { NotificationStatus } from '../../../core/models/enums/notificationstatus';
import { INotificationOption } from '../../../core/models/notificationoptions/notificationoption.model';
import { RenewalStore } from '../../../core/store/renewalstore';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'mygexa-home-carousel',
  templateUrl: './home-carousel.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 10000, noPause: false } }
  ],
  styleUrls: ['./home-carousel.component.scss']
})
export class HomeCarouselComponent implements OnInit, OnDestroy {
  serviceAccountServiceSubscription: Subscription = null;
  offersServiceSubscription: Subscription = null;
  notificationOptionsStoreSubscription: Subscription = null;
  renewalStoreSubscription: Subscription = null;
  SearchNotificationOptions = null;
  IsUpForRenewal: boolean = null;
  IsRenewalPending: boolean = null;
  public promoCode: string = null;
  ActiveServiceAccount: ServiceAccount = null;
  GexaCarouselOffer: IOffers;
  IsOnGexaLyric: boolean = null;
  IsPaperless: boolean = null;
  NotificationOptions: INotificationOption = null;

  constructor( private ServiceAccountService: ServiceAccountService,
               private renewalStore: RenewalStore,
               private NotificationOptionsStore: NotificationOptionsStore,
               private OfferStore: OffersStore) { }
  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        if (this.ActiveServiceAccount) {
        this.OfferStore.LoadLyricOfferDetails(this.ActiveServiceAccount.TDU_DUNS_Number);
          this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(renewalDetails => {
            if (renewalDetails) {
              this.IsUpForRenewal = renewalDetails.Is_Account_Eligible_Renewal;
              this.IsRenewalPending = renewalDetails.Is_Pending_Renewal;
            }
          });
        this.offersServiceSubscription = this.OfferStore.GexaLyricOffer.subscribe(
          GexaOffer => {
            if (!GexaOffer) {
              return;
            }
            this.GexaCarouselOffer = GexaOffer[0];
            this.promoCode =
              GexaOffer[0] ?
                (GexaOffer[0].Promotion ? (GexaOffer[0].Promotion.Code ? GexaOffer[0].Promotion.Code : null ) : null) : null;

            this.notificationOptionsStoreSubscription = this.NotificationOptionsStore.Notification_Options.subscribe(
              Options => {
                if (Options && Options.length > 0) {
                  this.NotificationOptions = Options[0];
                  if (String(this.NotificationOptions.Status) === NotificationStatus[NotificationStatus.Active]) {
                    this.IsPaperless = Boolean(this.NotificationOptions.Paperless);
                  }
                }
              }
            );
            if (GexaOffer[0] && this.ActiveServiceAccount.Current_Offer.Rate_Code === GexaOffer[0].Rate_Code) {
              this.IsOnGexaLyric = true;
              this.IsPaperless = Boolean(this.NotificationOptions.Paperless);
              // this.IsPaperless = this.ActiveServiceAccount.Paperless_Billing;
            }
          }
        );
      }
      });
  }

  ngOnDestroy() {
    this.serviceAccountServiceSubscription.unsubscribe();
    if (this.offersServiceSubscription) {
      this.offersServiceSubscription.unsubscribe();
    }
    if (this.renewalStoreSubscription) {
      this.renewalStoreSubscription.unsubscribe();
    }
  }
}
