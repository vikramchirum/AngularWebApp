import { Component, OnInit } from '@angular/core';
import { indexOf } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import MockData from 'app/authenticated/my-account/order-status/order.mock-data.json';
import { OrderStatusService } from '../../../core/order-status.service';
import { OrderStatus } from '../../../core/models/order-status.model';
import { UserService } from 'app/core/user.service';

@Component({
  selector: 'mygexa-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  public orderData;// = MockData;
  public openCharges = [];
  public orderDetails: OrderStatus[] = null;
  private UserCustomerAccountSubsciption: Subscription = null;

  // get data() {
  //   console.log('slice', this.orderData.slice(0, this.orderData.length));
  //   return this.orderData.slice(0, this.orderData.length);
  // }

  constructor(private orderStatusService: OrderStatusService,
    private UserService: UserService, ) {
    this.UserCustomerAccountSubsciption = this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => {
        this.getOrderStatusByCustomerId(CustomerAccountId);
      }
    );
  }


  ngOnInit() {
  }

  getOrderStatusByCustomerId(customerId) {
    this.orderStatusService.fetchOrderDetails(customerId).subscribe(
      result => {
        console.log('******Order Status********', result)
        this.orderData = result;
      }
    );
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
