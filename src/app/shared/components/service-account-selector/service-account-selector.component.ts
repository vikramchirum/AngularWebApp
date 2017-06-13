import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';

@Component({
  selector: 'mygexa-service-account-selector',
  templateUrl: './service-account-selector.component.html',
  styleUrls: ['./service-account-selector.component.scss']
})
export class ServiceAccountSelectorComponent implements OnInit {

  BillingAccounts: BillingAccount[];
  BillingAccountSelected: string;

  @Input() selectedBillingAccount: string = null;
  @Input() selectorLabel: string = null;
  @Output() changedBillingAccount: EventEmitter<any> =  new EventEmitter<any>();

  constructor(
    private BillingAccountService: BillingAccountService
  ) {}

  ngOnInit() {
    if (this.selectedBillingAccount) {
      this.BillingAccountService
        .getBillingAccount(this.selectedBillingAccount)
        .then((BillingAccount: BillingAccount) => this.BillingAccountSelected = BillingAccount.Id);
    } else {
      this.BillingAccountService
        .getCurrentBillingAccount()
        .then((BillingAccount: BillingAccount) => this.BillingAccountSelected = BillingAccount.Id);
    }
  }

  changeBillingAccount() {
    this.changedBillingAccount.emit(this.BillingAccountSelected);
  }

}
