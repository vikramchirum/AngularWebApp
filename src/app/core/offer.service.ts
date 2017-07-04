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
   * @param TDU_DUNS_Number
   * @returns {Observable<any[]>}
   */

  getOffers(TDU_DUNS_Number: number): Observable<any[]> {

    return this.http
      .get(`/v2/Offers?option.plan.tDU.duns_Number=957877905`)
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
