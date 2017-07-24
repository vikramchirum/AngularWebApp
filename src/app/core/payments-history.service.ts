import { Injectable } from '@angular/core';

import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { PaymentsHistory } from './models/payments-history.model';
import { BillingAccountService } from './BillingAccount.service';
import { BillingAccountClass } from './models/BillingAccount.model';
import { map, orderBy } from 'lodash';

@Injectable()
export class PaymentsHistoryService {

  private activeBillingAccount: BillingAccountClass = null;

  private cachedPaymentHistory: PaymentsHistory[] = null;

  constructor(
    private HttpClient: HttpClient,
    private BillingAccountService: BillingAccountService
  ) {
    // Clear the cache if the active billing account changes.
    this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => {
        this.cachedPaymentHistory = null;
        this.activeBillingAccount = activeBillingAccount;
      }
    );
  }

  AddNewPaymentToHistory(paymentHistory: PaymentsHistory): void {
    if (this.cachedPaymentHistory !== null) {
      this.cachedPaymentHistory.unshift(new PaymentsHistory(paymentHistory));
    }
  }

  /**
   * Returns billing account payments history based on Id
   * @param billingAccount
   * @returns {Observable<PaymentsHistory[]>}
   */
  GetPaymentsHistory(billingAccount: BillingAccountClass): Observable<PaymentsHistory[]> {

    return this.HttpClient
      .get(`/billing_accounts/${billingAccount.Id}/payments_history`)
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error))
      .map(res => orderBy(map(res, PaymentsHistoryItem => new PaymentsHistory(PaymentsHistoryItem)), ['Payment_Date'], ['desc']))
      .map(PaymentsHistory => this.cachedPaymentHistory = PaymentsHistory);
  }

  GetPaymentsHistoryCacheable(billingAccount: BillingAccountClass): Observable<PaymentsHistory[]> {

    if (this.cachedPaymentHistory) {
      return Observable.of(this.cachedPaymentHistory).delay(0);
    }

    return this.GetPaymentsHistory(billingAccount);

  }

}
