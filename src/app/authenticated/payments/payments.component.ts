import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  reactToChangedBillingAccount(BillingAccount_Id) {
    console.log(BillingAccount_Id);
  }

}
