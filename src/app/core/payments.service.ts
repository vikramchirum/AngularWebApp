import { Injectable } from '@angular/core';

import {HttpClient} from './httpclient';
import {CustomerAccountService} from './CustomerAccount.service';
import {IPaymethod} from './models/paymethod/Paymethod.model';
import {ServiceAccount} from './models/serviceaccount/serviceaccount.model';
import {CustomerAccount} from './models/customeraccount/customeraccount.model';

@Injectable()
export class PaymentsService {

  private CustomerAccount: CustomerAccount = null;

  constructor(private HttpClient: HttpClient, private CustomerAccountService: CustomerAccountService) {
    this.CustomerAccountService.CustomerAccountObservable.subscribe(
      CustomerAccount => this.CustomerAccount = CustomerAccount
    );
  }

  MakePayment(username: string, amount: number, serviceAccount: ServiceAccount, Paymethod: IPaymethod) {
    const body = {
      UserName: username,
      AuthorizationAmount: amount,
      ServiceAccountId: serviceAccount.Id,
      RequestedDate: Date.now.toLocaleString(),
      Source: 'azureAPI',
      Paymethod
    };

    return this.HttpClient.post(`/Payments?convertPayMethod=false`, JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  SchedulePayment(username: string, amount: number, serviceAccount: ServiceAccount, Paymethod: IPaymethod, requestedDate: Date) {
    const body = {
      UserName: username,
      AuthorizationAmount: amount,
      ServiceAccountId: serviceAccount.Id,
      RequestedDate: Date.now.toLocaleString(),
      Source: 'azureAPI',
      Paymethod,
      DraftDate: requestedDate.toLocaleString()
    };

    return this.HttpClient.post(`/Payments/Schedule?convertPayMethod=false`, JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }

  CancelScheduledPayment(username: string, amount: number, serviceAccount: ServiceAccount, Paymethod: IPaymethod, dueDate: Date) {
    const body = {
      UserName: username,
      AuthorizationAmount: amount,
      ServiceAccountId: serviceAccount.Id,
      Paymethod,
      DraftDate: dueDate.toLocaleDateString(),
      BillingSystemAccountKey: `${serviceAccount.Id}-3`
    };

    return this.HttpClient.post(`/Payments/Schedule/Cancel`, JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }
}
