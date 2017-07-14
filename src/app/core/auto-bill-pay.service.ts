import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { BillingAccountClass } from './models/BillingAccount.model';
import { PaymethodClass } from './models/Paymethod.model';
import { isFunction, noop } from 'lodash';

@Injectable()
export class AutoBillPayService {

  constructor(
    private HttpClient: HttpClient
  ) { }

  EnrollInAutoBillPay(
    billingAccount: BillingAccountClass,
    paymethod: PaymethodClass,
    callback?: Function
  ): Observable<Response> {

    const now = new Date;
    const body = JSON.stringify({
      StartDate: now,
      TermAcceptanceDate: now,
      PayMethodId: paymethod.PayMethodId,
      BillingAccountList: [
        {
          BillingAccountId: billingAccount.Id,
          BillingSystem: 'GEMS',
          AccountTypeName: 'ContractServicePoint',
          BusinessUnit: 'GEXA'
        }
      ]
    });

    const request = this.HttpClient.post('/AutoPaymentConfigs/EnrollAutoPay', body)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));

    request.subscribe(
      res => console.log('POST api/AutoPaymentConfigs/EnrollAutoPay res', res),
      err => console.log('POST api/AutoPaymentConfigs/EnrollAutoPay err', err),
      () => {
        billingAccount.Is_Auto_Bill_Pay = true;
        billingAccount.PayMethodId = paymethod.PayMethodId;
        if (isFunction(callback)) { callback(); }
      }
    );

    return request;

  }

  CancelAutoBillPay(
    billingAccount: BillingAccountClass,
    callback?: Function
  ): Observable<Response> {

    const body = JSON.stringify({
      Billing_Account_Id: billingAccount.Id
    });
    const request = this.HttpClient.put('/AutoPaymentConfigs/CancelAutoPay', body)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));

    request.subscribe(
      res => console.log('PUT api/AutoPaymentConfigs/CancelAutoPay res', res),
      err => console.log('PUT api/AutoPaymentConfigs/CancelAutoPay err', err),
      () => {
        billingAccount.Is_Auto_Bill_Pay = false;
        billingAccount.PayMethodId = null;
        if (isFunction(callback)) { callback(); }
      }
    );

    return request;

  }

  UpdateAutoBillPay(
    billingAccount: BillingAccountClass,
    paymethod: PaymethodClass,
    callback?: Function
  ): Observable<Response> {

    const now = new Date;
    const body = {
      TermAcceptanceDate: now,
      PayMethodId: paymethod.PayMethodId,
      BillingAccountList: [
        {
          BillingAccountId: billingAccount.Id,
          BillingSystem: 'GEMS',
          AccountTypeName: 'ContractServicePoint',
          BusinessUnit: 'GEXA'
        }
      ]
    };

    console.log('/AutoPaymentConfigs/ModifyAutoPay', JSON.stringify(body, null, '  '));

    const request = this.HttpClient.put('/AutoPaymentConfigs/ModifyAutoPay', JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));

    request.subscribe(
      res => console.log('PUT api/AutoPaymentConfigs/ModifyAutoPay res', res),
      err => console.log('PUT api/AutoPaymentConfigs/ModifyAutoPay err', err),
      () => {
        billingAccount.PayMethodId = paymethod.PayMethodId;
        if (isFunction(callback)) { callback(); }
      }
    );

    return request;

  }

}
