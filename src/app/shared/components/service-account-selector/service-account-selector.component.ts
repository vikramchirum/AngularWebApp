
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { find, get } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import {ServiceAccount} from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-service-account-selector',
  templateUrl: './service-account-selector.component.html',
  styleUrls: ['./service-account-selector.component.scss']
})
export class ServiceAccountSelectorComponent implements OnInit, OnDestroy {

  @Input() setActiveServiceAccount: boolean = null;
  @Input() selectedServiceAccount: ServiceAccount = null;
  @Input() selectorLabel: string = null;
  @Output() changedServiceAccount: EventEmitter<any> =  new EventEmitter<any>();

  private ServiceAccounts: ServiceAccount[] = null;
  private ServiceAccountSelectedId: string = null;
  private ServiceAccountsSubscription: Subscription = null;
  private ActiveServiceAccountsSubscription: Subscription = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ServiceAccountsObservable.subscribe(
      ServiceAccounts => {
        this.ServiceAccounts = ServiceAccounts;
        this.ChangeDetectorRef.detectChanges();
      }
    );
    if (this.selectedServiceAccount) {
      this.ServiceAccountSelectedId = this.selectedServiceAccount.Id;
    } else {
      this.ActiveServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
        ActiveServiceAccount => {
          this.ServiceAccountSelectedId = get(ActiveServiceAccount, 'Id', null);
          this.ChangeDetectorRef.detectChanges();
        }
      );
    }
  }

  ngOnDestroy() {
    // Clean up our subscribers to avoid memory leaks.
    this.ServiceAccountsSubscription.unsubscribe();
    // If we're listening for the active service account then clean it up.
    if (this.ActiveServiceAccountsSubscription) { this.ActiveServiceAccountsSubscription.unsubscribe(); }
  }

  changeServiceAccount() {
    // Look for the selected service account and emit the change with it.
    const SelectedServiceAccount = find(this.ServiceAccounts, { Id: this.ServiceAccountSelectedId });

    // If we're setting the global account then do so here.
    if (this.setActiveServiceAccount) { this.ServiceAccountService.SetActiveServiceAccount(SelectedServiceAccount, false); }

    // Emit this change-event to any listeners.
    if (SelectedServiceAccount) { this.changedServiceAccount.emit(SelectedServiceAccount); }
  }

}
