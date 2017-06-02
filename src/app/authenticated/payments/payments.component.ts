import { Component, OnInit } from '@angular/core';

import { BillingAccount, BillingAccountService } from 'services/BillingAccount';

@Component({
  selector: 'mygexa-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  BillingAccounts: BillingAccount[];
  activeBillingAccount: string;

  constructor(
    private BillingAccountService: BillingAccountService
  ) { }

  ngOnInit() {
    this.BillingAccountService.getBillingAccounts()
      .then(data => this.BillingAccounts = data)
      .then(() => this.activeBillingAccount = this.BillingAccounts[0].Id);
  }

}
