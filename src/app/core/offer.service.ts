import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class OfferService {

  constructor(private http: HttpClient) {
  }

  /**
   * Returns billing account usage history based on Id
   * @param offer
   * @returns {Observable<any[]>}
   */

  getOffers(offer): Observable<any[]> {
    console.log("Offer params", offer)
    return this.http
      .get(`/v2/Offers?option.startDate=${offer.startDate}&option.plan.tDU.duns_Number=${offer.dunsNumber}`)
      .map((response: Response) => this.processApiData(response))
      .catch(this.handleError);
  }

    private processApiData(res: Response) {
      return res.json();

    }

     private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

}
