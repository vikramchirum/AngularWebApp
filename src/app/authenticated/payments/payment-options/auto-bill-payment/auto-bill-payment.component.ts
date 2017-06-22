import { Component, OnDestroy, OnInit } from '@angular/core';

import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { PaymentMethod, PaymentMethodService } from 'app/core/PaymentMethod';
import { Subscription } from 'rxjs/Subscription';

let temporaryAutoBillPaymentMethod: PaymentMethod = null;

@Component({
  selector: 'mygexa-auto-bill-payment',
  templateUrl: './auto-bill-payment.component.html',
  styleUrls: ['./auto-bill-payment.component.scss']
})
export class AutoBillPaymentComponent implements OnInit, OnDestroy {

  switchingAutoBillPay: boolean = null;

  autoBillPaymentMethod: PaymentMethod = null;

  private ActiveBillingAccount: BillingAccountClass = null;
  private BillingAccounts: BillingAccountClass[] = [];
  private BillingAccountsSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService,
    private PaymentMethodService: PaymentMethodService
  ) {
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable
      .subscribe((BillingAccounts: BillingAccountClass[]) => {
        this.ActiveBillingAccount = this.BillingAccountService.ActiveBillingAccount;
        this.BillingAccounts = BillingAccounts;
      });
  }

  ngOnInit() {
    this.autoBillPaymentMethod = temporaryAutoBillPaymentMethod;
  }

  ngOnDestroy() {
    this.BillingAccountsSubscription.unsubscribe();
    temporaryAutoBillPaymentMethod = this.autoBillPaymentMethod;
  }

  enrollInAutoBillPaySelected(selectedPaymentMethod: PaymentMethod): void {
    this.BillingAccountService
      .applyNewAutoBillPay(selectedPaymentMethod, this.BillingAccountService.ActiveBillingAccount, true)
      .then(() => this.autoBillPaymentMethod = selectedPaymentMethod);
  }

  unenrollInAutoBillPaySelected(): void {
    this.BillingAccountService
      .applyNewAutoBillPay(null, this.BillingAccountService.ActiveBillingAccount, false)
      .then(() => {
        this.autoBillPaymentMethod = null;
      });
  }

  switchingAutoBillPaySelected(selectedPaymentMethod: PaymentMethod) {
    // TODO: do we need to call separately to remove the old payment method?.. or is that handled by the back-end API?
    if (selectedPaymentMethod !== this.autoBillPaymentMethod) {
      this.BillingAccountService
        .applyNewAutoBillPay(selectedPaymentMethod, this.BillingAccountService.ActiveBillingAccount, true)
        .then(() => this.autoBillPaymentMethod = selectedPaymentMethod);
    }
    this.switchingAutoBillPay = false;
  }

}
