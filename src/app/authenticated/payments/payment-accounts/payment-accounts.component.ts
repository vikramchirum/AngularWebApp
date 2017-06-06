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
  changingPaymentMethod: PaymentMethod = null;
  deletePaymentMethod: PaymentMethod = null;

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

  isInactive(paymentMethod: PaymentMethod): boolean {
    return (this.changingPaymentMethod !== null && this.changingPaymentMethod !== paymentMethod);
  }

  change($event, paymentMethod) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    this.changingPaymentMethod = paymentMethod;

  }

  changeCancel() {
    this.changingPaymentMethod = null;
  }

  changeSubmit() {
    alert ('Work with Forte.');
    this.changeCancel();
  }

  delete($event, paymentMethod) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    this.deletePaymentMethod = paymentMethod;

    this.$modal.modal('show');

  }

  delete_confirm() {

    this.PaymentMethodService.deletePaymentMethod(this.deletePaymentMethod.Id);

    if (this.changingPaymentMethod === this.deletePaymentMethod) { this.changingPaymentMethod = null; }

    this.$modal.modal('hide');

  }

}
