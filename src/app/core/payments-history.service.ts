import {Injectable} from '@angular/core';

import {map, orderBy} from 'lodash';
import {HttpClient} from './httpclient';
import {Observable} from 'rxjs/Observable';

import {PaymentsHistory} from './models/payments/payments-history.model';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {ServiceAccount} from 'app/core/models/serviceaccount/serviceaccount.model';

@Injectable()
export class PaymentsHistoryService {

  private activeServiceAccount: ServiceAccount = null;
  private cachedPaymentHistory: PaymentsHistory[] = null;

  constructor(private HttpClient: HttpClient, private serviceAccountService: ServiceAccountService) {
    // Clear the cache if the active service account changes.
    this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.cachedPaymentHistory = null;
        this.activeServiceAccount = activeServiceAccount;
      }
    );
  }

  AddNewPaymentToHistory(paymentHistory: PaymentsHistory): void {
    if (this.cachedPaymentHistory !== null) {
      this.cachedPaymentHistory.unshift(new PaymentsHistory(paymentHistory));
    }
  }

  GetPaymentsHistory(serviceAccount: ServiceAccount): Observable<PaymentsHistory[]> {
    return this.HttpClient
      .get(`/service_accounts/${serviceAccount.Id}/payments_history`)
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error))
      .map(res => orderBy(map(res, PaymentsHistoryItem => new PaymentsHistory(PaymentsHistoryItem)), ['Payment_Date'], ['desc']))
      .map(PaymentsHistory => this.cachedPaymentHistory = PaymentsHistory);
  }

  GetPaymentsHistoryCacheable(serviceAccount: ServiceAccount): Observable<PaymentsHistory[]> {
    if (this.cachedPaymentHistory) {
      return Observable.of(this.cachedPaymentHistory).delay(0);
    }
    return this.GetPaymentsHistory(serviceAccount);
  }
}
