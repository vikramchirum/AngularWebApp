import { Component } from '@angular/core';
import { indexOf } from 'lodash';

import MockData from 'app/authenticated/my-account/order-status/order.mock-data.json';

@Component({
  selector: 'mygexa-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent {

  public orderData = MockData;
  public openCharges = [];

  get data() {
    return MockData.slice(0, MockData.length);
  }

  constructor() {
    this.openCharges = [];
  }

  public orderOpened(charge) {
    return this.openCharges.indexOf(charge) >= 0;
  }

  public orderToggle(charge) {
    const indexOf = this.openCharges.indexOf(charge);
    if (indexOf < 0) {
      this.openCharges.push(charge);
    } else {
      this.openCharges.splice(indexOf, 1);
    }
  }

}
