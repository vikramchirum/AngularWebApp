
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';

@Component({
  selector: 'mygexa-service-account-selector',
  templateUrl: './service-account-selector.component.html',
  styleUrls: ['./service-account-selector.component.scss']
})
export class ServiceAccountSelectorComponent implements OnInit, OnDestroy {

  @Input() selectedBillingAccount: BillingAccount = null;
  @Input() selectorLabel: string = null;
  @Output() changedBillingAccount: EventEmitter<any> =  new EventEmitter<any>();

  private BillingAccounts: BillingAccount[] = null;
  private BillingAccountSelectedId: string = null;
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService
  ) {}

  ngOnInit() {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable.subscribe(
      (BillingAccounts: BillingAccount[]) => {
        this.BillingAccounts = BillingAccounts;
        // If there is not provided billing account to select, use the Billing Account Service's.
        if (
          this.selectedBillingAccount === null
          || this.BillingAccounts.indexOf(this.selectedBillingAccount) < 0
        ) {
          this.BillingAccountSelectedId = this.BillingAccountService.ActiveBillingAccount.Id;
        } else {
          this.BillingAccountSelectedId = this.selectedBillingAccount.Id;
        }
      },
      // TODO: handle errors.
      error => console.log('error', error)
    );
  }

  ngOnDestroy() {
    // Clean up our subscriber to avoid memeory leaks.
    this.BillingAccountsSubscription.unsubscribe();
  }

  changeBillingAccount() {
    // Look for the selected billing account and emit the change with it.
    for (const index in this.BillingAccounts) {
      if (
        this.BillingAccounts[index]
        && this.BillingAccounts[index].Id === this.BillingAccountSelectedId
      ) {
        this.changedBillingAccount.emit(this.BillingAccounts[index]);
        break;
      }
    }
  }

}
