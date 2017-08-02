
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { sortBy, values } from 'lodash';
import { HttpClient } from './httpclient';
import { UsageHistory } from './models/usage-history.model';
import { ServiceAccount } from './models/serviceaccount/serviceaccount.model';
import { ServiceAccountService } from './serviceaccount.service';

@Injectable()
export class UsageHistoryService {

  private activeServiceAccount: ServiceAccount = null;

  constructor(private HttpClient: HttpClient, private serviceAccountService: ServiceAccountService) {
    this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => this.activeServiceAccount = activeServiceAccount
    );
  }

  getUsageHistory(serviceAccountId: number): Observable<UsageHistory[]> {
    return this.HttpClient
      .get(`/service_accounts/${serviceAccountId}/usage_history`)
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
