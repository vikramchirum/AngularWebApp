import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OrderStatusService } from '../../../core/order-status.service';
import { OrderStatus } from '../../../core/models/order-status.model';
import { UserService } from 'app/core/user.service';

@Component({
  selector: 'mygexa-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  public openCharges = [];
  public orderDetails: OrderStatus[] = null;
  private UserCustomerAccountSubscription: Subscription = null;

  constructor(private orderStatusService: OrderStatusService,
              private UserService: UserService) {
    this.UserCustomerAccountSubscription = this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => {
        if (CustomerAccountId) {
          this.getOrderStatusByCustomerId(CustomerAccountId);
        }
      }
    );
  }


  ngOnInit() {
  }

  getOrderStatusByCustomerId(customerId) {
    this.orderStatusService.fetchOrderDetails(customerId).subscribe(
      result => {
        console.log('******Order Status********', result);
        this.orderDetails = result;
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

  ngOnDestroy() {
    // Un-subscribe to prevent memory-leaks:
    if (this.UserCustomerAccountSubscription) {
      this.UserCustomerAccountSubscription.unsubscribe();
    }
  }
}
