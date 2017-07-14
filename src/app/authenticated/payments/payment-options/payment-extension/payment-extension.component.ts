import { Component, OnInit } from '@angular/core';

import { Bill, BillService } from 'app/core/Bill';

// TODO: remove this once we're getting the user's "extension requested status" from the API.
let temp_requestedExtension = false;

@Component({
  selector: 'mygexa-payment-extension',
  templateUrl: './payment-extension.component.html',
  styleUrls: ['./payment-extension.component.scss']
})
export class PaymentExtensionComponent implements OnInit {

  Bill: Bill = null;

  pastDueAmount: number = null;
  requestedExtension: boolean = null;
  requestedExtensionRecently: boolean = null;

  constructor(
    private BillService: BillService
  ) {}

  ngOnInit() {
    this.BillService.getCurrentBill()
      .then((Bill: Bill) => {
        this.pastDueAmount = Bill.balance_forward;
      });
    // TODO: get the data from the API.
    this.requestedExtension = temp_requestedExtension;
  }

  requestExtension(): void {
    // TODO: post data to the API.
    this.requestedExtension = temp_requestedExtension = true;
    this.requestedExtensionRecently = true;
  }

}
