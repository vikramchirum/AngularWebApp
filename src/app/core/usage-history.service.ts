
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { sortBy, values } from 'lodash';
import { HttpClient } from './httpclient';
import { UsageHistory } from './models/usage/usage-history.model';
import { UsageComparison } from './models/usage/usage-comparison.model';
import { ServiceAccount } from './models/serviceaccount/serviceaccount.model';
import { ServiceAccountService } from './serviceaccount.service';
import * as moment from 'moment';
import { MonthlyProfiledBill, DailyProfiledBill, HourlyProfiledBill } from './models/profiledbills/profiled-bills.model';

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

  getUsageComparison(UAN: string): Observable<UsageComparison> {
    return this.HttpClient
      .get(`/usage/ercot_detailed_usage`, { params: { uan: UAN, meter_read_cycles: 2 } })
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getUsagePrediction(UAN: string, endDate: Date): Observable<UsageComparison> {
    return this.HttpClient
      .get(`/usage/ercot_detailed_usage`, { params: { uan: UAN, meter_read_cycles: 1, as_of_date: endDate  } })
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getPastUsageHistory(UAN: string, cycleMonth: number, cycleYear: number): Observable<UsageComparison> {
    return this.HttpClient
      .get(`/usage/ercot_metercycle_daily_usage`, { params: { uan: UAN, month: cycleMonth, year: cycleYear } })
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getMonthlyProfiledBill(UAN: string, startMonth: Date, endMonth: Date): Observable<[MonthlyProfiledBill]> {
    return this.HttpClient
      .get(`/ProfiledBills/monthy`, { params: { uan: UAN, usageMonthStart: startMonth.toLocaleDateString(), usageMonthEnd: endMonth.toLocaleDateString() } })
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getDailyProfiledBill(UAN: string, usageMonth: Date): Observable<[DailyProfiledBill]> {
    return this.HttpClient
      .get(`/profiledbills/daily`, { params: { uan: UAN, usageMonth: usageMonth.toLocaleDateString() } })
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getHourlyProfiledBill(UAN: string, date: Date): Observable<[HourlyProfiledBill]> {
    return this.HttpClient
      .get(`/profiledbills/days`, { params: { uan: UAN, date: date.toLocaleDateString() } })
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  private processApiData(data) {
    const months = {};

    for (const index in data) {
      if (data[index]) {
        if (!months[data[index].Usage_Month]) {
          months[data[index].Usage_Month] = {
            usage: 0,
            //date: new Date(data[index].Usage_Month)
            date: moment(data[index].Usage_Month, moment.ISO_8601).toDate()
          };
        }
        months[data[index].Usage_Month].usage += data[index].Usage;
      }
    }
    //console.log("******",months);
    return sortBy(values(months));
  }
}
