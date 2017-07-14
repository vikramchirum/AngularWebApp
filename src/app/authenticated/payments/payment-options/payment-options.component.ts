import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

  private ActiveBillingAccountSubscription: Subscription = null;

  private _ActiveBillingAccount: BillingAccountClass = null;
  get ActiveBillingAccount() { return this._ActiveBillingAccount; }
  set ActiveBillingAccount(ActiveBillingAccount) {
    this._ActiveBillingAccount = ActiveBillingAccount;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    public Router: Router,
    private BillingAccountService: BillingAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      ActiveBillingAccount => this.ActiveBillingAccount = ActiveBillingAccount
    );
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
  }

}
