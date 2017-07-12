
import { Injectable } from '@angular/core';

import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { UsageHistory } from './models/usage-history.model';
import { BillingAccountService } from './BillingAccount.service';
import { BillingAccountClass } from './models/BillingAccount.model';
import { sortBy, values } from 'lodash';

@Injectable()
export class UsageHistoryService {

  private activeBillingAccount: BillingAccountClass = null;

  constructor(
    private HttpClient: HttpClient,
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

    return this.HttpClient
      .get(`/billing_accounts/${billingAccountId}/usage_history`)
      .map(res => res.json())
      .map(res => this.processApiData(res))
      .catch(error => this.HttpClient.handleHttpError(error));
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

    return sortBy(values(months));

  }

}
