import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AutoBillPayService } from 'app/core/auto-bill-pay.service';
import { PaymethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { PaymethodService } from 'app/core/Paymethod.service';
import { PaymethodClass, IPaymethodRequestEcheck, IPaymethodRequestCreditCard } from 'app/core/models/Paymethod.model';
import { Subscription } from 'rxjs/Subscription';
import { find, get } from 'lodash';

interface IPaymentMessage {
  classes: string[];
  innerHTML: string;
}

@Component({
  selector: 'mygexa-payment-accounts',
  templateUrl: './payment-accounts.component.html',
  styleUrls: ['./payment-accounts.component.scss']
})
export class PaymentAccountsComponent implements OnInit, OnDestroy {

  @ViewChild(PaymethodAddCcComponent)
  private addCreditCardComponent: PaymethodAddCcComponent;
  @ViewChild(PaymethodAddEcheckComponent)
  private addEcheckComponent: PaymethodAddEcheckComponent;

  addingEcheck: boolean = null;
  addingEcheckFormValid: boolean = null;
  addingCreditCard: boolean = null;
  addingCreditCardFormValid: boolean = null;
  ActiveBillingAccount: BillingAccountClass = null;
  ActiveBillingAccountSubscription: Subscription = null;
  BillingAccounts: BillingAccountClass[] = null;
  BillingAccountsSubscription: Subscription = null;
  PaymentMessage: IPaymentMessage = null;
  PaymentAbpSelecting: PaymethodClass = null;

  private _PaymentEditting: PaymethodClass = null;
  get PaymentEditting(): PaymethodClass { return this._PaymentEditting; }
  set PaymentEditting(payMethod) {
    this._PaymentEditting = payMethod;
    // BUGFIX: The below fixes a rendering bug.
    // If the user adds a Paymethod, and tries to remove a
    // paymethod the editing prompt won't show.
    this.ChangeDetectorRef.detectChanges();
  }

  private _PaymentAbpSelected: PaymethodClass = null;
  get PaymentAbpSelected(): PaymethodClass { return this._PaymentAbpSelected; }
  set PaymentAbpSelected(payMethod) {
    this._PaymentAbpSelected = payMethod;
    // BUGFIX: The below fixes a rendering bug.
    // If the user adds a Paymethod, and tries to remove an ABP
    // paymethod and select a new method, the check won't show.
    this.ChangeDetectorRef.detectChanges();
  }


  private PaymethodSubscription: Subscription = null;
  private _Paymethods: PaymethodClass[] = null;
  get Paymethods(): PaymethodClass[] { return this._Paymethods; }
  set Paymethods(Paymethods: PaymethodClass[]) {
    this._Paymethods = Paymethods;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private AutoBillPayService: AutoBillPayService,
    private BillingAccountService: BillingAccountService,
    private PaymethodService: PaymethodService
  ) { }

  ngOnInit() {
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      ActiveBillingAccount => this.ActiveBillingAccount = ActiveBillingAccount
    );
    this.BillingAccountsSubscription = this.BillingAccountService.BillingAccountsObservable.subscribe(
      BillingAccounts => this.BillingAccounts = BillingAccounts
    );
    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
    this.BillingAccountsSubscription.unsubscribe();
    this.PaymethodSubscription.unsubscribe();
  }

  isUsedForAutoBillPay(paymethod: PaymethodClass): boolean {
    return !!find(this.BillingAccounts, ['PayMethodId', paymethod.PayMethodId]);
  }

  removePaymethod(paymentMethod: PaymethodClass): void {
    if (
      !paymentMethod
      || this.PaymentEditting === paymentMethod
    ) {
      this.PaymentEditting = null;
    } else if (paymentMethod) {
      this.PaymentEditting = paymentMethod;
    }
  }

  removePaymethodConfirm(): void {

    const PaymethodToDelete = this.PaymentEditting;

    this.PaymethodService.RemovePaymethod(PaymethodToDelete).subscribe(
      result => this.PaymentMessage = {
        classes: ['alert', 'alert-success'],
        innerHTML: `<b>Ok!</b> your payment account, ending in <b>${ PaymethodToDelete.getLast() }</b> was deleted!`
      },
      error => console.log('handle error => ', error),
      () => this.removePaymethodEditAutoPayCancel()
    );

  }

  removePaymethodStopAutoPay(): void {

    const PaymethodToDelete = this.PaymentEditting;

    // this.AutoBillPayService.CancelAutoBillPay(
    //   this.ActiveBillingAccount
    // );

    this.PaymethodService.RemovePaymethod(PaymethodToDelete).subscribe(
      result => this.PaymentMessage = {
        classes: ['alert', 'alert-success'],
        innerHTML: [
          `<b>Ok!</b> your payment account, ending in <b>${ PaymethodToDelete.getLast() }</b> was deleted`,
          ` and <b>Auto Pay</b> has been stopped!`
        ].join('')
      },
      error => console.log('handle error => ', error),
      () => this.removePaymethodEditAutoPayCancel()
    );

  }

  removePaymethodEditAutoPay(): void {
    this.PaymentAbpSelecting = this.PaymentEditting;
    this.PaymentEditting = this.PaymentAbpSelected = null;
  }

  removePaymethodEditAutoPayConfirm(): void {

    const PaymethodToDelete = this.PaymentEditting;
    const PaymethodToUse = this.PaymentAbpSelected;

    // this.AutoBillPayService.UpdateAutoBillPay(
    //   this.ActiveBillingAccount,
    //   PaymethodToUse
    // );

    this.PaymethodService.RemovePaymethod(PaymethodToDelete).subscribe(
      () => this.PaymentMessage = {
        classes: ['alert', 'alert-success'],
        innerHTML: [
          `<b>Ok!</b> your payment account, ending in <b>${ PaymethodToDelete.getLast() }</b> was deleted and `,
          `<b>Auto Bill Pay</b> is using your payment account ending in <b>${ PaymethodToUse.getLast() }</b>!`
        ].join('')
      },
      error => console.log('handle error => ', error),
      () => this.removePaymethodEditAutoPayCancel()
    );

  }

  removePaymethodEditAutoPayCancel(): void {
    this.PaymentEditting = this.PaymentAbpSelecting = null;
  }

  addingCreditCardToggle(open: boolean): void {
    this.addingCreditCard = open !== false;
    if (this.addingCreditCard) { this.addingCreditCardFormValid = false; }
  }

  addingCreditCardFormChanged($event: string): void {
    this.addingCreditCardFormValid = $event === 'valid';
  }

  addingCreditCardSubmit() {
    this.addingCreditCard = false;
    this.PaymentMessage = {
      classes: ['alert', 'alert-info'],
      innerHTML: `<i class="fa fa-fw fa-spinner fa-spin"></i> <b>Please wait</b> we're adding your new payment method now.`
    };
    this.PaymethodService.AddPaymethodCreditCardFromComponent(this.addCreditCardComponent).subscribe(
      result => {
        const accountNumber = get(result, 'CreditCard.AccountNumber');
        if (accountNumber) {
          this.PaymentMessage = {
            classes: ['alert', 'alert-success'],
            innerHTML: `<b>Ok!</b> your credit account, ending in <b>${ accountNumber }</b> has been added as a payment method!`
          };
        }
        this.PaymethodService.UpdatePaymethods();
      }
    );
  }

  addingEcheckToggle(open: boolean): void {
    this.addingEcheck = open !== false;
    if (this.addingEcheck) { this.addingEcheckFormValid = false; }
  }

  addingEcheckFormChanged($event: string): void {
    this.addingEcheckFormValid = $event === 'valid';
  }

  addingEcheckSubmit() {
    this.addingEcheck = false;
    this.PaymentMessage = {
      classes: ['alert', 'alert-info'],
      innerHTML: `<i class="fa fa-fw fa-spinner fa-spin"></i> <b>Please wait</b> we're adding your new payment method now.`
    };
    this.PaymethodService.AddPaymethodEcheckFromComponent(this.addEcheckComponent).subscribe(
      result => {
        const accountNumber = get(result, 'BankAccount.AccountNumber');
        if (accountNumber) {
          this.PaymentMessage = {
            classes: ['alert', 'alert-success'],
            innerHTML: `<b>Ok!</b> your bank account, ending in <b>${ accountNumber }</b> has been added as a payment method!`
          };
        }
        this.PaymethodService.UpdatePaymethods();
      }
    );
  }

}
