import { Component, OnInit } from '@angular/core';
import {paymentsData} from './payments-data'

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './payment-history-payments.component.html',
  styleUrls: ['./payment-history-payments.component.scss']
})
export class PaymentHistoryPaymentsComponent implements OnInit {
 private paymentData:Array<any>;
  constructor() { }

  ngOnInit() {
    this.paymentData = paymentsData;
  }

}
