import { Component, OnInit } from '@angular/core';

import MockData from './ledger-data.json';

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {

  private paymentData: Array<any>;

  constructor() { }

  ngOnInit() {
    this.paymentData = MockData;
  }

}
