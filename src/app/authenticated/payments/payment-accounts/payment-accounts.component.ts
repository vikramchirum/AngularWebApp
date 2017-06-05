import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import * as $ from 'jquery';

declare var jQuery: $;

@Component({
  selector: 'mygexa-payment-accounts',
  templateUrl: './payment-accounts.component.html',
  styleUrls: ['./payment-accounts.component.scss']
})
export class PaymentAccountsComponent implements OnInit, AfterViewInit {
  @ViewChild('modal_delete') modal_delete;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() { }

  delete($event) {

    if ($event && $event.preventDefault) { $event.preventDefault(); }

    try {
      jQuery(this.modal_delete.nativeElement).modal('show');
    } catch (error) {
      console.log(error);
    }

  }

}
