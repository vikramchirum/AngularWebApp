import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import * as $ from 'jquery';
import { PaymentMethod, PaymentMethodService } from 'app/core/PaymentMethod';

declare const jQuery: $;

@Component({
  selector: 'mygexa-payment-accounts',
  templateUrl: './payment-accounts.component.html',
  styleUrls: ['./payment-accounts.component.scss']
})
export class PaymentAccountsComponent implements OnInit, AfterViewInit {
  @ViewChild('modal_delete') modal_delete;

  $modal: $ = null;
  changing = false;
  selectedPaymentMethod: PaymentMethod = null;

  constructor(
    private PaymentMethodService: PaymentMethodService
  ) { }

  ngOnInit() {
    this.PaymentMethodService.getPaymentMethods()
      .then(data => console.log(data));
  }

  ngAfterViewInit() {
    this.$modal = jQuery(this.modal_delete.nativeElement);
  }

  change($event, paymentMethod) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    this.selectedPaymentMethod = paymentMethod;

    this.changing = true;

  }

  delete($event, paymentMethod) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    this.selectedPaymentMethod = paymentMethod;

    this.$modal.modal('show');

  }

  delete_confirm() {

    this.PaymentMethodService.deletePaymentMethod(this.selectedPaymentMethod.Id);

    this.$modal.modal('hide');

  }

}
