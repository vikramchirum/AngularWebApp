import { Injectable } from '@angular/core';

import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { AutoPaymentConfig, IAutoPaymentConfigEnroll, IAutoPaymentConfigUpdate } from './models/auto-payment-config.model';
import { map } from 'lodash';

export interface ISearchAutoPaymentsRequest {
  autoPaymentConfigId?: string | number;
  paymethodId?: string | number;
}

@Injectable()
export class AutoBillPayService {

  constructor(
    private HttpClient: HttpClient
  ) { }

  public CancelAutoPayment(id: string): Observable<boolean> {
    return this.HttpClient.delete(`/AutoPaymentConfigs?autoPayConfigId=${id}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  public SearchAutoPayments(request: ISearchAutoPaymentsRequest): Observable<AutoPaymentConfig[]> {
    let query;

    if (request.autoPaymentConfigId) {
      query = `/AutoPaymentConfigs?autoPaymentConfigId=${request.autoPaymentConfigId}`;
    } else if (request.paymethodId) {
      query = `/AutoPaymentConfigs?paymethodId=${request.paymethodId}`;
    }

    if (!query) {
      return Observable.of(null);
    }

    return this.HttpClient.get(query)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => map(res, data => new AutoPaymentConfig(data)));
  }

  public EnrollAutoPayment(request: IAutoPaymentConfigEnroll): Observable<AutoPaymentConfig> {
    return this.HttpClient.post('/AutoPaymentConfigs', JSON.stringify(request))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => new AutoPaymentConfig(res));
  }

  public UpdateAutoPayment(request: IAutoPaymentConfigUpdate): Observable<AutoPaymentConfig> {
    return this.HttpClient.put('/AutoPaymentConfigs', JSON.stringify(request))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => new AutoPaymentConfig(res));
  }

  public GetAutoPayment(id: string): Observable<AutoPaymentConfig> {
    return this.HttpClient.get(`/AutoPaymentConfigs/${id}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => new AutoPaymentConfig(res));
  }
}
