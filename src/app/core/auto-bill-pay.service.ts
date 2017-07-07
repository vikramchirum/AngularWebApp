import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { HttpClient, HandleError } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { BillingAccountClass } from './models/BillingAccount.model';
import { PaymentMethod } from './PaymentMethod';

@Injectable()
export class AutoBillPayService {

  constructor(
    private HttpClient: HttpClient
  ) { }

  EnrollInAutoBillPay(
    billingAccount: BillingAccountClass,
    paymentMethod: PaymentMethod
  ): Observable<Response> {

    const now = new Date;
    const body = JSON.stringify({
      StartDate: now,
      TermAcceptanceDate: now,
      PayMethodId: paymentMethod.Id,
      BillingAccountId: billingAccount.Id
    });

    const request = this.HttpClient.post('AutoPaymentConfigs', body)
      .map(res => res.json())
      .catch(err => HandleError(err));

    request.subscribe(res => console.log('POST AutoPaymentConfigs res', res));

    return request;

  }

  CancelAutoBillPay(
    billingAccount: BillingAccountClass
  ): Observable<Response> {

    const request = this.HttpClient.delete('AutoPaymentConfigs', billingAccount.Id)
      .map(res => res.json())
      .catch(err => HandleError(err));

    request.subscribe(res => console.log('DELETE AutoPaymentConfigs res', res));

    return request;

  }

  UpdateAutoBillPay(
    billingAccount: BillingAccountClass,
    paymentMethod: PaymentMethod
  ): Observable<Response> {

    const now = new Date;
    const body = JSON.stringify({
      StartDate: now,
      TermAcceptanceDate: now,
      PayMethodId: paymentMethod.Id,
      BillingAccountId: billingAccount.Id
    });

    const request = this.HttpClient.put('AutoPaymentConfigs', body)
      .map(res => res.json())
      .catch(err => HandleError(err));

    request.subscribe(res => console.log('PUT AutoPaymentConfigs res', res));

    return request;

  }

}
