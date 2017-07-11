import { Injectable } from '@angular/core';

import { HttpClient } from './httpclient';

@Injectable()
export class PaymentsService {

  constructor(
    private HttpClient: HttpClient
  ) { }

  makePayment() {

    const body = {};

    const request = this.HttpClient.post('/Payments', JSON.stringify(body))
      .map(result => result.json());
      // .catch(error => this.HttpClient.h);

    request.subscribe(res => console.log('res', res));

    return request;

  }

}
