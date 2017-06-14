import {Component, OnDestroy, OnInit} from '@angular/core';

import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit, OnDestroy {

  public selectedBillingAccount: BillingAccount = null;
  public editingBillingAccount: BillingAccount = null;
  public editingAddress: boolean = null;

  private BillingAccounts: BillingAccount[] = null;
  private BillingAccountsSubscription: Subscription = null;

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
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable.subscribe(
      (BillingAccounts: BillingAccount[]) => {
        console.log(new Date);
        this.selectedBillingAccount = this.BillingAccountService.ActiveBillingAccount;
        this.BillingAccounts = BillingAccounts;
      }
    );
  }

  ngOnDestroy() {
    this.BillingAccountsSubscription.unsubscribe();
  }

  toggleAddressEdit() {
    this.editingBillingAccount = this.selectedBillingAccount;
    this.editingAddress = !this.editingAddress;
  }

}
