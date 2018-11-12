import { Injectable } from '@angular/core';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { IPaymentExtension } from './models/paymentextension/payment-extension.model';
import { IPaymentExtensionV1 } from './models/paymentextension/payment-extension-v1.model';
import { IPaymentExtensionGrantRequest } from './models/paymentextension/payment-extention-grant-request.model';
import { IPaymentExtensionGrantResponse } from './models/paymentextension/payment-extention-grant-response.model';

@Injectable()
export class PaymentExtensionService {
  constructor(private http: HttpClient) {
  }
  getPaymentExtensionStatus(grantRequest: IPaymentExtensionGrantRequest): Observable<IPaymentExtensionGrantResponse> {
    const body = grantRequest;
    // const relativePath = `/PaymentExtension`;
    const relativePath = `/PaymentExtension/V1`;
    return this.http.post(relativePath, body)
      .map(data => { data.json(); return data.json(); })
      .map(data => <IPaymentExtensionGrantResponse>data)
      .catch(error => this.http.handleHttpError(error));
  }

  checkPaymentExtensionStatus(serviceAccountId: string): Observable<IPaymentExtensionV1> {
    // const relativePath = `/PaymentExtension?service_account_id=` + serviceAccountId;
    const relativePath = `/PaymentExtension/V1?request.serviceAccountId=` + serviceAccountId;
    return this.http.get(relativePath)
      .map(data => { return data.json(); })
      .map(data => <IPaymentExtensionV1>data)
      .catch(error => this.http.handleHttpError(error));
  }
}
