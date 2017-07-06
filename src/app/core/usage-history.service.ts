
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';


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

  getUsageHistory(billingAccountId: number): Observable<UsageHistory[]> {

    return this.http
      .get(`/billing_accounts/${billingAccountId}/usage_history`)
      .map((response: Response) => this.processApiData(response))
      .catch(this.handleError);
  }

  private processApiData(res: Response) {
    let data = res.json();
    let groupedByDate = _.groupBy(data, function (item) {
      return (item as any).Usage_Month;//.substring(0,7);
    });

    var aggregateData = _.map(groupedByDate, function (UsageObject, usage_Month) {
      return {
        Usage_Month: usage_Month,
        Usage: _.reduce(UsageObject, function (m, x) {
          return m + (x as any).Usage;
        }, 0)
      };
    });

    aggregateData.forEach((d) => {
      //conversion of string to dates.
      (d as any).Usage_Month = new Date((d as any).Usage_Month);
    });
    console.log(aggregateData)
    return aggregateData;
  }

  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
