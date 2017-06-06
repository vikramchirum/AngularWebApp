import { Component, OnInit } from '@angular/core';

import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';

@Component({
  selector: 'mygexa-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  BillingAccounts: BillingAccount[];
  BillingAccountSelected: string;

  constructor(
    private BillingAccountService: BillingAccountService
  ) { }

  changeBillingAccount() {
    alert(this.BillingAccountSelected);
  }

  ngOnInit() {
    this.BillingAccountService.getCurrentBillingAccount()
      .then((BillingAccount: BillingAccount) => this.BillingAccountSelected = BillingAccount.Id);
  }

}
