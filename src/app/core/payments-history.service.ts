import { Injectable } from '@angular/core';

import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { PaymentsHistory } from './models/payments-history.model';
import { BillingAccountService } from './BillingAccount.service';
import { BillingAccountClass } from './models/BillingAccount.model';
import { map } from 'lodash';

@Injectable()
export class PaymentsHistoryService {

  private activeBillingAccount: BillingAccountClass = null;

  public PaymentsHistory: PaymentsHistory[] = null;

  constructor(
    private HttpClient: HttpClient,
    private BillingAccountService: BillingAccountService
  ) {
    this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => this.activeBillingAccount = activeBillingAccount
    );
  }

  AddNewPaymentToHistory(paymentHistory: PaymentsHistory): void {
    if (this.PaymentsHistory !== null) {
      this.PaymentsHistory.unshift(new PaymentsHistory(paymentHistory));
    }
  }

  /**
   * Returns billing account payments history based on Id
   * @param billingAccount
   * @returns {Observable<PaymentsHistory[]>}
   */
  GetPaymentsHistory(billingAccount: BillingAccountClass): Observable<PaymentsHistory[]> {

    if (this.PaymentsHistory) {
      return Observable.of(this.PaymentsHistory);
    }

    return this.HttpClient
      .get(`/billing_accounts/${billingAccount.Id}/payments_history`)
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error))
      .map(res => map(res, PaymentsHistoryItem => new PaymentsHistory(PaymentsHistoryItem)));
  }

}
