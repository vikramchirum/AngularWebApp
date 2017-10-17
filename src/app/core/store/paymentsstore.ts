import { Injectable } from '@angular/core';
import { PaymentsHistory } from '../models/payments/payments-history.model';
import { BehaviorSubject } from 'rxjs/Rx';
import { PaymentsHistoryService } from '../payments-history.service';
import { HttpClient } from '../httpclient';
import { ServiceAccount } from '../models/serviceaccount/serviceaccount.model';

@Injectable()

export class PaymentsHistoryStore {
  private _paymentHistory: BehaviorSubject<PaymentsHistory[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private paymentHistoryService: PaymentsHistoryService ) {
  }

  get PaymentHistory() {
    return this._paymentHistory.asObservable();
  }

  LoadPaymentsHistory(serviceAccount: ServiceAccount) {
    this.paymentHistoryService.GetPaymentsHistory(serviceAccount).subscribe(
      PaymentHistory => {
        this._paymentHistory.next(PaymentHistory);
      }
    );
  }
}
