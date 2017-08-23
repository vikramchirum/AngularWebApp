import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import { clone, forEach, pull, map } from 'lodash';
import { HttpClient } from './httpclient';
import {AllOffersClass, UpgradeOffersClass} from './models/offers/alloffers.model';
import { ServiceAccountService } from './serviceaccount.service';
import {ServiceAccount} from './models/serviceaccount/serviceaccount.model';
import {IOffers} from './models/offers/offers.model';


@Injectable()
export class OfferService {

  constructor(private http: HttpClient, private serviceAccountService: ServiceAccountService) {
  }

  getOffers(offer): Observable<IOffers[]> {
    console.log ( 'Offer params', offer);
    return this.http
      .get(`/v2/Offers?option.startDate=${offer.startDate}&option.plan.tDU.duns_Number=${offer.dunsNumber}`)
      .map(data => { data.json(); return data.json(); })
      .map(data =>  <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }
  private processApiData(res: Response) {
    return res.json();
  }

  getRenewalOffers(ActiveServiceAccountId: Number): Observable<AllOffersClass[]> {
   return this.http.get(`/service_accounts/${ActiveServiceAccountId}/offers`)
      .map(data => data.json())
      .map(data =>  { map(data, OffersData => new AllOffersClass(OffersData)); console.log('Offers', data); return data; })
      .catch(error => this.http.handleHttpError(error));
  }

  getUpgradeOffers(ActiveServiceAccountId: Number, ActiveServiceAccount_CuurentOffer_Term: Number, ActiveServiceAccount_TDU_DUNS_Number: Number): Observable<IOffers[]> {
     return this.http.get(`/v2/Offers?option.approved=true&option.startDate=${new Date}&option.plan.term_Greater_Than=${ActiveServiceAccount_CuurentOffer_Term}&option.plan.tDU.duns_Number=${ActiveServiceAccount_TDU_DUNS_Number}`)
        .map(data => { data.json(); return data.json(); })
        .map(data =>  <IOffers[]>data['Items'])
        .catch(error => this.http.handleHttpError(error));
  }
}
