import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {clone, forEach, pull, map} from 'lodash';
import {HttpClient} from './httpclient';
import {AllOffersClass, UpgradeOffersClass} from './models/offers/alloffers.model';
import {ServiceAccountService} from './serviceaccount.service';
import {IOffers} from './models/offers/offers.model';


@Injectable()
export class OfferService {


  constructor(private http: HttpClient, private serviceAccountService: ServiceAccountService) {
  }

  getOffers(offer): Observable<IOffers[]> {
    console.log('Offer params', offer);
    return this.http
      .get(`/v2/Offers?option.startDate=${offer.startDate}&option.plan.tDU.duns_Number=${offer.dunsNumber}&option.approved=${offer.approved}&option.pageSize=${offer.page_size}&option.plan.featured_Channel_Ids=${offer.channelId}`)
      .map(data => {
        data.json();
        return data.json();
      })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }

  getRenewalOffers(ActiveServiceAccountId: string): Observable<AllOffersClass[]> {
    return this.http.get(`/service_accounts/${ActiveServiceAccountId}/offers`)
      .map(data => data.json())
      .map(data => {
        map(data, OffersData => new AllOffersClass(OffersData));
        // console.log('Offers', data);
        return data;
      })
      .catch(error => this.http.handleHttpError(error));
  }

  getUpgradeOffers(ActiveServiceAccountId: string): Observable<IOffers[]> {
    return this.http.get(`/service_accounts/${ActiveServiceAccountId}/upgrades`)
      .map(data => { data.json(); return data.json(); })
      .map(data => <IOffers[]>data)
      .catch(error => this.http.handleHttpError(error));
  }

  getRenewalPlansByPromoCode(promoCode: string, ActiveServiceAccount_TDU_DUNS_Number: string): Observable<IOffers[]> {
    return this.http
      .get(`/v2/Offers?option.promotion.code=${promoCode}&option.approved=true&option.startDate=
    ${new Date().toISOString()}&option.plan.tDU.duns_Number=${ActiveServiceAccount_TDU_DUNS_Number}`)
      .map(data => {
        data.json();
        return data.json();
      })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }

  getLyricOfferDetails(ActiveServiceAccount_TDU_DUNS_Number: string) {
    return this.http.get(`/v2/Offers?option.approved=true&option.startDate=
    ${new Date().toISOString()}&option.promotion.code=LYRIC&option.plan.tDU.duns_Number=${ActiveServiceAccount_TDU_DUNS_Number}`)
      .map(data => {
        data.json();
        console.log('GexaLyricOffer', data.json());
        return data.json();
      })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }

  getOffersByChannel(Channel_Id: string): Observable<IOffers[]> {
    return this.http.get(`/v2/Offers?ov2/Offers?option.channel_Id=${Channel_Id}`)
      .map(data => {
        data.json();
        console.log('Channel offers', data.json());
        return data.json();
      })
      .map(data => <IOffers[]>data['Items'])
      .catch(error => this.http.handleHttpError(error));
  }
}
