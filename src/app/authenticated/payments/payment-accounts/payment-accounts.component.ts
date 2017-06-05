import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import * as $ from 'jquery';

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

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.$modal = jQuery(this.modal_delete.nativeElement)
  }

  change($event) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    this.changing = true;

  }

  delete($event) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    this.$modal.modal('show');

  }

  delete_confirm() {

    alert('Delete this account.');

    this.$modal.modal('hide');

  }

}
