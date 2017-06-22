
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { find } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';

@Component({
  selector: 'mygexa-service-account-selector',
  templateUrl: './service-account-selector.component.html',
  styleUrls: ['./service-account-selector.component.scss']
})
export class ServiceAccountSelectorComponent implements OnInit, OnDestroy {

  @Input() selectedBillingAccount: BillingAccountClass = null;
  @Input() selectorLabel: string = null;
  @Output() changedBillingAccount: EventEmitter<any> =  new EventEmitter<any>();

  private BillingAccounts: BillingAccountClass[] = null;
  private BillingAccountSelectedId: string = null;
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService
  ) {}

  ngOnInit() {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable.subscribe(
      (BillingAccounts: BillingAccountClass[]) => {
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
    // Clean up our subscriber to avoid memory leaks.
    this.BillingAccountsSubscription.unsubscribe();
  }

  changeBillingAccount() {
    // Look for the selected billing account and emit the change with it.
    const SelectedBillingAccount = find(this.BillingAccounts, { Id: this.BillingAccountSelectedId });
    if (SelectedBillingAccount) {
      this.changedBillingAccount.emit(SelectedBillingAccount);
    }
  }

}
