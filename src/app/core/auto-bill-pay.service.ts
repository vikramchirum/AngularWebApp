import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {isFunction} from 'lodash';

import {HttpClient} from './httpclient';
import {Paymethod} from './models/paymethod/Paymethod.model';
import {ServiceAccount} from './models/serviceaccount/serviceaccount.model';

@Injectable()
export class AutoBillPayService {

  constructor(private HttpClient: HttpClient) {
  }

  EnrollInAutoBillPay(serviceAccount: ServiceAccount, paymethod: Paymethod, callback?: Function): Observable<Response> {
    const now = new Date;
    const body = {
      StartDate: now,
      TermAcceptanceDate: now,
      PayMethodId: paymethod.PayMethodId,
      ServiceAccountList: [
        {
          ServiceAccountId: serviceAccount.Id,
          BillingSystem: 'GEMS',
          AccountTypeName: 'ContractServicePoint',
          BusinessUnit: 'GEXA'
        }
      ]
    };

    console.log('/AutoPaymentConfigs/EnrollAutoPay', JSON.stringify(body, null, '  '));

       const request = this.HttpClient.post('/AutoPaymentConfigs/EnrollAutoPay', JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));

    request.subscribe(
      res => console.log('POST api/AutoPaymentConfigs/EnrollAutoPay res', res),
      err => console.log('POST api/AutoPaymentConfigs/EnrollAutoPay err', err),
      () => {
        serviceAccount.Is_Auto_Bill_Pay = true;
        serviceAccount.PayMethodId = paymethod.PayMethodId;
        if (isFunction(callback)) {
          callback();
        }
      }
    );

    return request;
  }

  CancelAutoBillPay(serviceAccount: ServiceAccount, callback?: Function): Observable<Response> {

    const body = {
      Service_Account_Id: serviceAccount.Id
    };

    console.log('/AutoPaymentConfigs/CancelAutoPay', JSON.stringify(body, null, '  '));

    const request = this.HttpClient.put('/AutoPaymentConfigs/CancelAutoPay', JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));

    request.subscribe(
      res => console.log('PUT api/AutoPaymentConfigs/CancelAutoPay res', res),
      err => console.log('PUT api/AutoPaymentConfigs/CancelAutoPay err', err),
      () => {
        serviceAccount.Is_Auto_Bill_Pay = false;
        serviceAccount.PayMethodId = null;
        if (isFunction(callback)) { callback(); }
      }
    );

    return request;
  }

  UpdateAutoBillPay(serviceAccount: ServiceAccount, paymethod: Paymethod, callback?: Function): Observable<Response> {

    const now = new Date;
    const body = {
      TermAcceptanceDate: now,
      PayMethodId: paymethod.PayMethodId,
      ServiceAccountList: [
        {
          ServiceAccountId: serviceAccount.Id,
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
        serviceAccount.PayMethodId = paymethod.PayMethodId;
        if (isFunction(callback)) { callback(); }
      }
    );

    return request;
  }
}
