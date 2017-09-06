import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {OfferService} from '../offer.service';
import {IOffers} from '../models/offers/offers.model';
import {AllOffersClass} from '../models/offers/alloffers.model';

@Injectable()
export class OffersStore {
  private LatestUpgradeOffersData: BehaviorSubject<IOffers[]> = new BehaviorSubject(null);
  private LatestRenewalOffersData: BehaviorSubject<AllOffersClass[]> = new BehaviorSubject(null);
  constructor(private offersService: OfferService) {
  }
  get ServiceAccount_UpgradeOffers() {
    return this.LatestUpgradeOffersData.asObservable();
  }

  get ServiceAccount_RenewalOffers() {
    return this.LatestRenewalOffersData.asObservable();
  }
  // Caching upgrade offers.

  LoadUpgradeOffersData(ActiveServiceAccountId: string, Term: Number, TDU_DUNS_Number: string) {
    this.offersService.getUpgradeOffers(ActiveServiceAccountId, Term, TDU_DUNS_Number).subscribe(
      UpgradeOffers => this.LatestUpgradeOffersData.next(UpgradeOffers));
  }
  // Caching renewal offers.

  LoadRenewalOffersData(ActiveServiceAccountId: string) {
    this.offersService.getRenewalOffers(ActiveServiceAccountId).subscribe(
      RenewalOffers => {
        this.LatestRenewalOffersData.next(RenewalOffers);
      });
  }

}
