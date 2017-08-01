import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { forEach, get, isNumber, map, now, random } from 'lodash';
import { AutoPaymentConfigService } from 'app/core/auto-payment-config.service';
import { PaymethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { PaymethodService } from 'app/core/Paymethod.service';
import { Paymethod } from 'app/core/models/paymethod/Paymethod.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

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
  ActiveServiceAccount: ServiceAccount = null;
  ActiveServiceAccountSubscription: Subscription = null;
  ServiceAccounts: ServiceAccount[] = null;
  ServiceAccountsSubscription: Subscription = null;
  PaymentEdittingIsUsedForAutoPaymentTimestamp: number = null;
  PaymentMessage: IPaymentMessage = null;
  PaymentAbpSelecting: Paymethod = null;

  private autoPayConfigIdsToModify: string[] = null;

  private _PaymentEdittingIsUsedForAutoPayment: boolean = null;
  get PaymentEdittingIsUsedForAutoPayment(): boolean { return this._PaymentEdittingIsUsedForAutoPayment; }
  set PaymentEdittingIsUsedForAutoPayment(PaymentEdittingIsUsedForAutoPayment) {
    this._PaymentEdittingIsUsedForAutoPayment = PaymentEdittingIsUsedForAutoPayment;
    // BUGFIX: The below fixes a rendering bug.
    // If the user adds a Paymethod, and tries to remove a
    // paymethod the editing prompt won't show.
    this.ChangeDetectorRef.detectChanges();
  }

  private _PaymentEditting: Paymethod = null;
  get PaymentEditting(): Paymethod { return this._PaymentEditting; }
  set PaymentEditting(payMethod) {
    this._PaymentEditting = payMethod;
    this.PaymentEdittingIsUsedForAutoPayment = null;
    // BUGFIX: The below fixes a rendering bug.
    // If the user adds a Paymethod, and tries to remove a
    // paymethod the editing prompt won't show.
    this.ChangeDetectorRef.detectChanges();
  }

  private _PaymentAbpSelected: Paymethod = null;
  get PaymentAbpSelected(): Paymethod { return this._PaymentAbpSelected; }
  set PaymentAbpSelected(payMethod) {
    this._PaymentAbpSelected = payMethod;
    // BUGFIX: The below fixes a rendering bug.
    // If the user adds a Paymethod, and tries to remove an ABP
    // paymethod and select a new method, the check won't show.
    this.ChangeDetectorRef.detectChanges();
  }

  private PaymethodSubscription: Subscription = null;
  private _Paymethods: Paymethod[] = null;
  get Paymethods(): Paymethod[] { return this._Paymethods; }
  set Paymethods(Paymethods: Paymethod[]) {
    this._Paymethods = Paymethods;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private AutoPaymentConfigService: AutoPaymentConfigService,
    private ServiceAccountService: ServiceAccountService,
    private PaymethodService: PaymethodService
  ) { }

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => this.ActiveServiceAccount = ActiveServiceAccount
    );
    this.ServiceAccountsSubscription = this.ServiceAccountService.ServiceAccountsObservable.subscribe(
      ServiceAccounts => this.ServiceAccounts = ServiceAccounts
    );
    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
    this.ServiceAccountsSubscription.unsubscribe();
    this.PaymethodSubscription.unsubscribe();
  }

  removePaymethod(paymentMethod: Paymethod): void {
    const timestamp = this.PaymentEdittingIsUsedForAutoPaymentTimestamp = now();
    if (
      !paymentMethod
      || this.PaymentEditting === paymentMethod
    ) {
      this.PaymentEditting = null;
    } else if (paymentMethod) {
      this.PaymentEditting = paymentMethod;
      this.AutoPaymentConfigService.SearchAutoPayments({ paymethodId: paymentMethod.PayMethodId })
        // Simulate loading as too quick of a response does not result in good UX.
        .delay(random(500, 1500))
        // Only continue if our local timestamp matches the components, otherwise it's safe to assume the user navigated away.
        .filter(() => timestamp === this.PaymentEdittingIsUsedForAutoPaymentTimestamp)
        .subscribe(res => {
          this.autoPayConfigIdsToModify = <string[]>map(res, apc => apc.Id);
          this.PaymentEdittingIsUsedForAutoPayment = get(res, 'length', 0) > 0;
        });
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

    forEach(this.autoPayConfigIdsToModify, autoPayConfigId => {
      this.ServiceAccountService.RemoveAutoPaymentConfig(isNumber(autoPayConfigId) ? autoPayConfigId : Number(autoPayConfigId));
      this.AutoPaymentConfigService.CancelAutoPayment(autoPayConfigId).subscribe(
        res => console.log('CancelAutoPayment res', res),
        err => console.log('CancelAutoPayment err', err)
      );
    });

    this.PaymethodService.RemovePaymethod(PaymethodToDelete)
      .delay(random(500, 1500))
      .subscribe(
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

    forEach(this.autoPayConfigIdsToModify, autoPayConfigId => {
      this.ServiceAccountService.UpdateAutoPaymentConfig(
        isNumber(autoPayConfigId) ? autoPayConfigId : Number(autoPayConfigId),
        PaymethodToUse.PayMethodId
      );

      this.AutoPaymentConfigService.UpdateAutoPayment({
        APCId: autoPayConfigId,
        PayMethodId: PaymethodToUse.PayMethodId
      }).subscribe(
        res => console.log('UpdateAutoPayment res', res),
        err => console.log('UpdateAutoPayment err', err)
      );
    });

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
