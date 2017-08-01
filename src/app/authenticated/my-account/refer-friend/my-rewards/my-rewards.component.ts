import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {ServiceAccountService} from '../../../../core/serviceaccount.service';
import {ServiceAccount} from '../../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit, OnDestroy {

  public selectedServiceAccount: ServiceAccount = null;
  public editingServiceAccount: ServiceAccount = null;
  public editingAddress: boolean = null;

  private ServiceAccounts: ServiceAccount[] = null;
  private ServiceAccountsSubscription: Subscription = null;

  constructor(
    private ServiceAccountService: ServiceAccountService
  ) {
    this.editingAddress = false;
  }

  serviceChanged(newServiceAccount: ServiceAccount) {
    this.editingServiceAccount = newServiceAccount;
  }

  serviceUse() {
    this.selectedServiceAccount = this.editingServiceAccount;
    this.editingAddress = !this.editingAddress;
  }

  ngOnInit() {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ServiceAccountsObservable.subscribe(
      (ServiceAccounts: ServiceAccount[]) => {
        this.selectedServiceAccount = this.ServiceAccountService.ActiveServiceAccountCache;
        this.ServiceAccounts = ServiceAccounts;
      }
    );
  }

  ngOnDestroy() {
    this.ServiceAccountsSubscription.unsubscribe();
  }

  toggleAddressEdit() {
    this.editingServiceAccount = this.selectedServiceAccount;
    this.editingAddress = !this.editingAddress;
  }
}
