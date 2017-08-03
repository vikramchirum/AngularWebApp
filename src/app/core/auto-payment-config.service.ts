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
export class AutoPaymentConfigService {

  constructor(
    private HttpClient: HttpClient
  ) { }

  public CancelAutoPayment(autoPayConfigId: string | number): Observable<boolean> {
    return this.HttpClient.delete(`/AutoPaymentConfigs?autoPayConfigId=${autoPayConfigId}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  public SearchAutoPayments(SearchAutoPaymentsRequest: ISearchAutoPaymentsRequest): Observable<AutoPaymentConfig[]> {
    let query;

    if (SearchAutoPaymentsRequest.autoPaymentConfigId) {
      query = `/AutoPaymentConfigs?autoPaymentConfigId=${SearchAutoPaymentsRequest.autoPaymentConfigId}`;
    } else if (SearchAutoPaymentsRequest.paymethodId) {
      query = `/AutoPaymentConfigs?paymethodId=${SearchAutoPaymentsRequest.paymethodId}`;
    }

    if (!query) {
      return Observable.of(null);
    }

    return this.HttpClient.get(query)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => map(res, data => new AutoPaymentConfig(data)));
  }

  public EnrollAutoPayment(AutoPaymentConfigEnroll: IAutoPaymentConfigEnroll): Observable<AutoPaymentConfig> {
    return this.HttpClient.post('/AutoPaymentConfigs', JSON.stringify(AutoPaymentConfigEnroll))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => new AutoPaymentConfig(res));
  }

  public UpdateAutoPayment(AutoPaymentConfigUpdate: IAutoPaymentConfigUpdate): Observable<AutoPaymentConfig> {
    return this.HttpClient.put('/AutoPaymentConfigs', JSON.stringify(AutoPaymentConfigUpdate))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => new AutoPaymentConfig(res));
  }

  public GetAutoPayment(autoPayConfigId: string | number): Observable<AutoPaymentConfig> {
    return this.HttpClient.get(`/AutoPaymentConfigs/${autoPayConfigId}`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err))
      .map(res => new AutoPaymentConfig(res));
  }
}
