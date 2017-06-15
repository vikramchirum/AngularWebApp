import { Component, OnInit } from '@angular/core';

import MockData from './payments-data.json';

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  private paymentData: Array<any>;

  constructor() { }

  ngOnInit() {
    this.paymentData = MockData;
  }

}
