
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { find, get } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';

@Component({
  selector: 'mygexa-service-account-selector',
  templateUrl: './service-account-selector.component.html',
  styleUrls: ['./service-account-selector.component.scss']
})
export class ServiceAccountSelectorComponent implements OnInit, OnDestroy {

  @Input() setActiveBillingAccount: boolean = null;
  @Input() selectedBillingAccount: BillingAccountClass = null;
  @Input() selectorLabel: string = null;
  @Output() changedBillingAccount: EventEmitter<any> =  new EventEmitter<any>();

  private BillingAccounts: BillingAccountClass[] = null;
  private BillingAccountSelectedId: string = null;
  private BillingAccountsSubscription: Subscription = null;
  private ActiveBillingAccountsSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable.subscribe(
      BillingAccounts => {
        this.BillingAccounts = BillingAccounts;
        this.ChangeDetectorRef.detectChanges();
      }
    );
    if (this.selectedBillingAccount) {
      this.BillingAccountSelectedId = this.selectedBillingAccount.Id;
    } else {
      this.ActiveBillingAccountsSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
        ActiveBillingAccount => {
          this.BillingAccountSelectedId = get(ActiveBillingAccount, 'Id', null);
          this.ChangeDetectorRef.detectChanges();
        }
      );
    }
  }

  ngOnDestroy() {
    // Clean up our subscribers to avoid memory leaks.
    this.BillingAccountsSubscription.unsubscribe();
    // If we're listening for the active billing account then clean it up.
    if (this.ActiveBillingAccountsSubscription) { this.ActiveBillingAccountsSubscription.unsubscribe(); }
  }

  changeBillingAccount() {
    // Look for the selected billing account and emit the change with it.
    const SelectedBillingAccount = find(this.BillingAccounts, { Id: this.BillingAccountSelectedId });

    // If we're setting the global account then do so here.
    if (this.setActiveBillingAccount) { this.BillingAccountService.SetActiveBillingAccount(SelectedBillingAccount); }

    // Emit this change-event to any listeners.
    if (SelectedBillingAccount) { this.changedBillingAccount.emit(SelectedBillingAccount); }
  }

}
