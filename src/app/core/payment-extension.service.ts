import { Injectable } from '@angular/core';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import { IPaymentExtension } from './models/paymentextension/payment-extension.model';
@Injectable()
export class PaymentExtensionService {
  constructor(private http: HttpClient) {
  }
  getPaymentExtensionStatus(serviceAccountId: string): Observable<IPaymentExtension> {
    const body = {
      ServiceAccountId: serviceAccountId
    };
    const relativePath = `/PaymentExtension`;
    return this.http.post(relativePath, body)
      .map(data => { data.json(); ; console.log('Payment extension: ', data.json() ) ; return data.json(); })
      .map(data => <IPaymentExtension>data)
      .catch(error => this.http.handleHttpError(error));
  }

}
