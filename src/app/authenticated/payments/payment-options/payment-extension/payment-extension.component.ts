import { Component, OnInit } from '@angular/core';


// TODO: remove this once we're getting the user's "extension requested status" from the API.
let temp_requestedExtension = false;

@Component({
  selector: 'mygexa-payment-extension',
  templateUrl: './payment-extension.component.html',
  styleUrls: ['./payment-extension.component.scss']
})
export class PaymentExtensionComponent implements OnInit {

  pastDueAmount: number = null;
  requestedExtension: boolean = null;
  requestedExtensionRecently: boolean = null;

  constructor(
  ) {}

  ngOnInit() {

  }

  requestExtension(): void {
    // TODO: post data to the API.
    this.requestedExtension = temp_requestedExtension = true;
    this.requestedExtensionRecently = true;
  }

}
