import { Injectable } from '@angular/core';

import { HttpClient } from './httpclient';
import { BillingAccountClass } from './models/BillingAccount.model';
import { CustomerAccountService } from './CustomerAccount.service';
import { IPaymethod } from './models/Paymethod.model';
import { CustomerAccountClass } from './models/CustomerAccount.model';

@Injectable()
export class PaymentsService {

  private CustomerAccount: CustomerAccountClass = null;

  constructor(
    private HttpClient: HttpClient,
    private CustomerAccountService: CustomerAccountService
  ) {
    this.CustomerAccountService.CustomerAccountObservable.subscribe(
      CustomerAccount => this.CustomerAccount = CustomerAccount
    );
  }

  MakePayment(
    amount: number,
    BillingAccount: BillingAccountClass,
    Paymethod: IPaymethod
  ) {

    const body = {
      AuthorizationAmount: amount,
      BillingAccountId: BillingAccount.Id,
      RequestedDate: new Date,
      Source: 'azureAPI',
      Paymethod
    };

    return this.HttpClient.post(`/Payments?convertPayMethod=false`, JSON.stringify(body))
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));

  }

}
