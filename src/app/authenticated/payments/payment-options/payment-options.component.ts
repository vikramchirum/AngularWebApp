import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements OnInit, OnDestroy {

  ActiveBillingAccount: BillingAccount = null;
  private BillingAccounts: BillingAccount[] = [];
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    public router: Router,
    private BillingAccountService: BillingAccountService
  ) {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable
      .subscribe((BillingAccounts: BillingAccount[]) => {
        this.ActiveBillingAccount = this.BillingAccountService.ActiveBillingAccount;
        this.BillingAccounts = BillingAccounts;
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.BillingAccountsSubscription.unsubscribe();
  }

}
