import {Component, OnDestroy, OnInit} from '@angular/core';

import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit, OnDestroy {

  public selectedBillingAccount: BillingAccountClass = null;
  public editingBillingAccount: BillingAccountClass = null;
  public editingAddress: boolean = null;

  private BillingAccounts: BillingAccountClass[] = null;
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService
  ) {
    this.editingAddress = false;
  }

  serviceChanged(newBillingAccount: BillingAccountClass) {
    this.editingBillingAccount = newBillingAccount;
  }

  serviceUse() {
    this.selectedBillingAccount = this.editingBillingAccount;
    this.editingAddress = !this.editingAddress;
  }

  ngOnInit() {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable.subscribe(
      (BillingAccounts: BillingAccountClass[]) => {
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
