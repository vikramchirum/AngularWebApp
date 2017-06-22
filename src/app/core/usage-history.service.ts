
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './httpclient';
import { Observable }  from 'rxjs/Observable';
import 'rxjs/add/operator/map';


import { UsageHistory } from './models/usage-history.model';

@Injectable()
export class UsageHistoryService {

  constructor(private http: HttpClient) {
  }

  /**
   * Returns billing account usage history based on Id 
   * @param billingAccountId
   * @returns {Observable<UsageHistory[]>}
   */

  getUsageHistory(billingAccountId: number): Observable<UsageHistory[]>   {
  
    return this.http
                .get(`/billing_accounts/${billingAccountId}/usage_history`)
                .map((response: Response) => this.processApiData(response))
                // {
                //     // console.log(response.json());
                //     return <UsageHistory[]> response.json();
                // })
                .catch(this.handleError);
  }

   private processApiData(res: Response) {
    let data = res.json();
    data.forEach((d) => {
     //conversion of string to dates.
    d.Usage_Month = new Date(d.Usage_Month);
   });   
    return data;
  }

  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
