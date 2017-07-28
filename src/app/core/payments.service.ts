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

  MakePayment(    amount: number, serviceAccount: ServiceAccount, Paymethod: IPaymethod) {

    const body = {
      AuthorizationAmount: amount,
      ServiceAccountId: serviceAccount.Id,
      RequestedDate: new Date,
      Source: 'azureAPI',
      Paymethod
    };

    return this.HttpClient.post(`/Payments?convertPayMethod=false`, JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }
}
