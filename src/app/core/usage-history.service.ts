
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';


import { UsageHistory } from './models/usage-history.model';
import {BillingAccountService} from "./BillingAccount.service";
import {BillingAccountClass} from "./models/BillingAccount.model";

@Injectable()
export class UsageHistoryService {

  private activeBillingAccount: BillingAccountClass = null;

  constructor(
    private http: HttpClient,
    private BillingAccountService: BillingAccountService
  ) {
    this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => this.activeBillingAccount = activeBillingAccount
    );
  }

  /**
   * Returns billing account usage history based on Id
   * @param billingAccountId
   * @returns {Observable<UsageHistory[]>}
   */

  getUsageHistory(billingAccountId: number): Observable<UsageHistory[]> {

    return this.http
      .get(`/billing_accounts/${billingAccountId}/usage_history`)
      .map(res => res.json())
      .map(res => this.processApiData(res))
      .catch(this.handleError);
  }

  private processApiData(data) {

    const months = {};

    for (const index in data) {
      if (data[index]) {

        if (!months[data[index].Usage_Month]) {
          months[data[index].Usage_Month] = {
            usage: 0,
            date: new Date(data[index].Usage_Month)
          };
        }

        months[data[index].Usage_Month].usage += data[index].Usage;

      }
    }

    return _.sortBy(_.values(months));

  }

  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
