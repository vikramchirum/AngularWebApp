import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { clone, forEach, pull, map } from 'lodash';
import { HttpClient } from './httpclient';
import { AllOffersClass, UpgradeOffersClass } from './models/offers/alloffers.model';
import { ServiceAccountService } from './serviceaccount.service';
import { ServiceAccount } from './models/serviceaccount/serviceaccount.model';
import { IOffers } from './models/offers/offers.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';


@Injectable()
export class OfferService {

  private LatestUpgradeOffersData: BehaviorSubject<IOffers[]> = new BehaviorSubject(null);
  private LatestRenewalOffersData: BehaviorSubject<AllOffersClass[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private serviceAccountService: ServiceAccountService) {
  }

  getOffers(offer): Observable<IOffers[]> {
    console.log('Offer params', offer);
    return this.http
      .get(`/v2/Offers?option.startDate=${offer.startDate}&option.plan.tDU.duns_Number=${offer.dunsNumber}`)
      .map(data => { data.json(); return data.json(); })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }

  getRenewalOffers(ActiveServiceAccountId: Number): Observable<AllOffersClass[]> {
    return this.http.get(`/service_accounts/${ActiveServiceAccountId}/offers`)
      .map(data => data.json())
      .map(data => { map(data, OffersData => new AllOffersClass(OffersData));
                      // console.log('Offers', data);
                      return data; })
      .catch(error => this.http.handleHttpError(error));
  }

  getUpgradeOffers(ActiveServiceAccountId: Number, ActiveServiceAccount_CuurentOffer_Term: Number, ActiveServiceAccount_TDU_DUNS_Number: Number): Observable<IOffers[]> {
    return this.http.get(`/v2/Offers?option.approved=true&option.startDate=${new Date}&option.plan.term_Greater_Than=
    ${ActiveServiceAccount_CuurentOffer_Term}&option.plan.tDU.duns_Number=${ActiveServiceAccount_TDU_DUNS_Number}`)
      .map(data => { data.json(); return data.json(); })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }

  getRenewalPlansByPromoCode(promoCode: string): Observable<IOffers[]> {
    return this.http
      .get(`/v2/Offers?option.promotion.code=${promoCode}`)
      .map(data => { data.json(); return data.json(); })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }

  // Caching upgrade offers.

  UpgradeOffersData(ActiveServiceAccountId: Number, Term: Number, TDU_DUNS_Number: Number) {
      this.getUpgradeOffers(ActiveServiceAccountId, Term, TDU_DUNS_Number).subscribe(
        UpgradeOffers => this.LatestUpgradeOffersData.next(UpgradeOffers));
  }

  get ServiceAccount_UpgradeOffers() {
    return this.LatestUpgradeOffersData.asObservable();
  }

  // Caching renewal offers.

  RenewalOffersData(ActiveServiceAccountId: Number) {
    this.getRenewalOffers(ActiveServiceAccountId).subscribe(
      RenewalOffers => {
        this.LatestRenewalOffersData.next(RenewalOffers);
      });
  }

  get ServiceAccount_RenewalOffers() {
    return this.LatestRenewalOffersData.asObservable();
  }

}
