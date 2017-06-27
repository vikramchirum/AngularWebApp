import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements OnInit, OnDestroy {

  private ActiveBillingAccount: BillingAccountClass = null;
  private BillingAccounts: BillingAccountClass[] = [];
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    public router: Router,
    private BillingAccountService: BillingAccountService
  ) {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable
      .subscribe((BillingAccounts: BillingAccountClass[]) => {
        this.ActiveBillingAccount = this.BillingAccountService.ActiveBillingAccountCache;
        this.BillingAccounts = BillingAccounts;
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.BillingAccountsSubscription.unsubscribe();
  }

}
