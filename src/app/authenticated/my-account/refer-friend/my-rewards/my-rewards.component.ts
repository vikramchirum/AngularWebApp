import { Component, OnInit } from '@angular/core';

import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit {

  public selectedBillingAccount: BillingAccount = null;
  public editingBillingAccount: BillingAccount = null;
  public editingAddress: boolean = null;

  private BillingAccounts: BillingAccount[] = null;

  constructor(
    private BillingAccountService: BillingAccountService
  ) {
    this.editingAddress = false;
  }

  serviceChanged(newBillingAccount: BillingAccount) {
    this.editingBillingAccount = newBillingAccount;
  }

  serviceUse() {
    this.selectedBillingAccount = this.editingBillingAccount;
    this.editingAddress = !this.editingAddress;
  }

  ngOnInit() {
    this.BillingAccountService.BillingAccountsObservable.subscribe(
      (BillingAccounts: BillingAccount[]) => {
        this.selectedBillingAccount = this.BillingAccountService.ActiveBillingAccount;
        this.BillingAccounts = BillingAccounts;
      }
    );
  }

  toggleAddressEdit() {
    this.editingBillingAccount = this.selectedBillingAccount;
    this.editingAddress = !this.editingAddress;
  }

}
