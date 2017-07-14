import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { PaymethodClass } from 'app/core/models/Paymethod.model';
import { PaymethodService } from 'app/core/Paymethod.service';
import { AutoBillPayService } from 'app/core/auto-bill-pay.service';
import { Subscription } from 'rxjs/Subscription';
import { find, includes } from 'lodash';

@Component({
  selector: 'mygexa-auto-bill-payment',
  templateUrl: './auto-bill-payment.component.html',
  styleUrls: ['./auto-bill-payment.component.scss']
})
export class AutoBillPaymentComponent implements OnInit, OnDestroy {

  protected includes = includes;

  switchingAutoBillPay: boolean = null;

  private _autoBillPaymethod: PaymethodClass = null;
  get autoBillPaymethod(): PaymethodClass { return this._autoBillPaymethod; }
  set autoBillPaymethod(autoBillPaymethod) {
    this._autoBillPaymethod = autoBillPaymethod;
    this.ChangeDetectorRef.detectChanges();
  }

  private ActiveBillingAccountsSubscription: Subscription = null;
  private _ActiveBillingAccount: BillingAccountClass = null;
  get ActiveBillingAccount() { return this._ActiveBillingAccount; }
  set ActiveBillingAccount(ActiveBillingAccount) {
    this._ActiveBillingAccount = ActiveBillingAccount;
    this.autoBillPaymethod = find(this.Paymethods, ['PayMethodId', ActiveBillingAccount.PayMethodId], null);
    this.ChangeDetectorRef.detectChanges();
  }

  private PaymethodsSubscription: Subscription = null;
  private _Paymethods: PaymethodClass[] = null;
  get Paymethods() { return this._Paymethods; }
  set Paymethods(Paymethods) {
    this._Paymethods = Paymethods;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    private BillingAccountService: BillingAccountService,
    private AutoBillPayService: AutoBillPayService,
    private PaymethodService: PaymethodService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ActiveBillingAccountsSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      ActiveBillingAccount => this.ActiveBillingAccount = ActiveBillingAccount
    );
    this.PaymethodsSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );
  }

  ngOnDestroy() {
    this.ActiveBillingAccountsSubscription.unsubscribe();
    this.PaymethodsSubscription.unsubscribe();
  }

  enrollInAutoBillPaySelected(selectedPaymethod: PaymethodClass): void {
    this.AutoBillPayService.EnrollInAutoBillPay(
      this.ActiveBillingAccount,
      selectedPaymethod,
      () => this.autoBillPaymethod = selectedPaymethod
    );
  }

  unenrollInAutoBillPaySelected(): void {
    this.AutoBillPayService.CancelAutoBillPay(
      this.ActiveBillingAccount,
      () => this.autoBillPaymethod = null
    );
  }

  switchingAutoBillPaySelected(selectedPaymethod: PaymethodClass) {
    if (selectedPaymethod !== this.autoBillPaymethod) {
      this.AutoBillPayService.UpdateAutoBillPay(
        this.ActiveBillingAccount,
        selectedPaymethod,
        () => this.autoBillPaymethod = selectedPaymethod
      );
    }
    this.switchingAutoBillPay = false;
  }

}
