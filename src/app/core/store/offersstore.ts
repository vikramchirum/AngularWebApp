import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

import { OfferService } from '../offer.service';
import { IOffers } from '../models/offers/offers.model';
import { AllOffersClass } from '../models/offers/alloffers.model';

@Injectable()
export class OffersStore {

  private _latestUpgradeOffersData: BehaviorSubject<IOffers[]> = new BehaviorSubject(null);
  private _latestRenewalOffersData: BehaviorSubject<AllOffersClass[]> = new BehaviorSubject(null);
  private _gexaLyricOffersData: BehaviorSubject<IOffers[]> = new BehaviorSubject(null);
  private _latestFeaturedOffersData: BehaviorSubject<IOffers[]> = new BehaviorSubject(null);

  constructor(private offersService: OfferService) {
  }

  get ServiceAccount_UpgradeOffers() {
    return this._latestUpgradeOffersData.asObservable().filter(offers => offers != null);
  }

  get ServiceAccount_RenewalOffers() {
    return this._latestRenewalOffersData.asObservable().filter(offers => offers != null);
  }

  get GexaLyricOffer() {
    return this._gexaLyricOffersData.asObservable().filter(offers => offers != null);
  }

  get Featured_Offers() {
    return this._latestFeaturedOffersData.asObservable().filter(offers => offers != null);
  }

  LoadUpgradeOffersData(Term: number, TDU_DUNS_Number: string) {
    this.offersService.getUpgradeOffers(Term, TDU_DUNS_Number).subscribe(
      UpgradeOffers => this._latestUpgradeOffersData.next(UpgradeOffers));
  }

  LoadRenewalOffersData(ActiveServiceAccountId: string) {
    this.offersService.getRenewalOffers(ActiveServiceAccountId).subscribe(
      RenewalOffers => {
        this._latestRenewalOffersData.next(RenewalOffers);
      });
  }
  LoadLyricOfferDetails(TDU_DUNS_Number: string) {
    this.offersService.getLyricOfferDetails(TDU_DUNS_Number).subscribe(
      GexaLyricOffer => {
        this._gexaLyricOffersData.next(GexaLyricOffer);
      }
    );
  }
  LoadFeaturedOffersData(Channel_Id: string) {
    this.offersService.getOffersByChannel(Channel_Id).subscribe(
      FeaturedOffers => {
        this._latestFeaturedOffersData.next(FeaturedOffers);
      });
  }
}
