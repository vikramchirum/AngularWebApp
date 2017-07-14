import { Component, OnDestroy, OnInit } from '@angular/core';

import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { PaymethodService } from 'app/core/Paymethod.service';
import { PaymethodClass } from 'app/core/models/Paymethod.model';
import { Subscription } from 'rxjs/Subscription';

let temporaryAutoBillPaymethod: PaymethodClass = null;

@Component({
  selector: 'mygexa-auto-bill-payment',
  templateUrl: './auto-bill-payment.component.html',
  styleUrls: ['./auto-bill-payment.component.scss']
})
export class AutoBillPaymentComponent implements OnInit, OnDestroy {

  switchingAutoBillPay: boolean = null;

  autoBillPaymethod: PaymethodClass = null;

  private ActiveBillingAccountCache: BillingAccountClass = null;
  private BillingAccounts: BillingAccountClass[] = [];
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService,
    private PaymethodService: PaymethodService
  ) {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable
      .subscribe((BillingAccounts: BillingAccountClass[]) => {
        this.ActiveBillingAccountCache = this.BillingAccountService.ActiveBillingAccountCache;
        this.BillingAccounts = BillingAccounts;
      });
  }

  ngOnInit() {
    this.autoBillPaymethod = temporaryAutoBillPaymethod;
  }

  ngOnDestroy() {
    this.BillingAccountsSubscription.unsubscribe();
    temporaryAutoBillPaymethod = this.autoBillPaymethod;
  }

  enrollInAutoBillPaySelected(selectedPaymethod: PaymethodClass): void {
    this.BillingAccountService
      .applyNewAutoBillPay(selectedPaymethod, this.BillingAccountService.ActiveBillingAccountCache, true)
      .then(() => this.autoBillPaymethod = selectedPaymethod);
  }

  unenrollInAutoBillPaySelected(): void {
    this.BillingAccountService
      .applyNewAutoBillPay(null, this.BillingAccountService.ActiveBillingAccountCache, false)
      .then(() => {
        this.autoBillPaymethod = null;
      });
  }

  switchingAutoBillPaySelected(selectedPaymethod: PaymethodClass) {
    // TODO: do we need to call separately to remove the old payment method?.. or is that handled by the back-end API?
    if (selectedPaymethod !== this.autoBillPaymethod) {
      this.BillingAccountService
        .applyNewAutoBillPay(selectedPaymethod, this.BillingAccountService.ActiveBillingAccountCache, true)
        .then(() => this.autoBillPaymethod = selectedPaymethod);
    }
    this.switchingAutoBillPay = false;
  }

}
