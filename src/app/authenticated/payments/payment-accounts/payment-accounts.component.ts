import { Component, OnInit, ViewChild } from '@angular/core';

import { PaymentMethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymentMethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { BillingAccountService } from 'app/core/BillingAccount';
import { PaymentMethod, PaymentMethodService } from 'app/core/PaymentMethod';

interface IPaymentMessage {
  classes: string[];
  innerHTML: string;
}

@Component({
  selector: 'mygexa-payment-accounts',
  templateUrl: './payment-accounts.component.html',
  styleUrls: ['./payment-accounts.component.scss']
})
export class PaymentAccountsComponent implements OnInit {

  PaymentMessage: IPaymentMessage = null;
  PaymentEditting: PaymentMethod = null;
  PaymentMethods: PaymentMethod[] = [];
  PaymentAbpSelecting: PaymentMethod = null;
  PaymentAbpSelected: PaymentMethod = null;

  @ViewChild(PaymentMethodAddCcComponent)
  private addCreditCardComponent: PaymentMethodAddCcComponent;
  @ViewChild(PaymentMethodAddEcheckComponent)
  private addEcheckComponent: PaymentMethodAddEcheckComponent;

  addingEcheck: boolean = null;
  addingEcheckFormValid: boolean = null;
  addingCreditCard: boolean = null;
  addingCreditCardFormValid: boolean = null;

  constructor(
    private BillingAccountService: BillingAccountService,
    private PaymentMethodService: PaymentMethodService
  ) {}

  ngOnInit() {
    this.PaymentMethodService.getPaymentMethods()
      .then((PaymentMethods: PaymentMethod[]) => this.PaymentMethods = PaymentMethods);
  }

  removePaymentMethod(paymentMethod: PaymentMethod): void {
    if (
      !paymentMethod
      || this.PaymentEditting === paymentMethod
    ) {
      this.PaymentEditting = null;
    } else if (paymentMethod) {
      this.PaymentEditting = paymentMethod;
    }
  }

  removePaymentMethodConfirm(): void {
    this.PaymentMessage = {
      classes: ['alert', 'alert-success'],
      innerHTML: `<b>Ok!</b> your payment account, ending in <b>${this.PaymentEditting.Card_Last}</b> was deleted!`
    };
    this.PaymentMethodService.deletePaymentMethod(this.PaymentEditting.Id)
      .then((PaymentMethods: PaymentMethod[]) => this.PaymentMethods = PaymentMethods);
  }

  removePaymentMethodStopAutoPay(): void {
    this.PaymentMessage = {
      classes: ['alert', 'alert-success'],
      innerHTML: [
        `<b>Ok!</b> your payment account, ending in <b>${this.PaymentEditting.Card_Last}</b> was deleted`,
        ` and <b>Auto Pay</b> has been stopped!`
      ].join('')
    };
    this.PaymentMethodService.deletePaymentMethod(this.PaymentEditting.Id)
      .then((PaymentMethods: PaymentMethod[]) => this.PaymentMethods = PaymentMethods);
  }

  removePaymentMethodEditAutoPay(): void {
    this.PaymentAbpSelecting = this.PaymentEditting;
    this.PaymentEditting = this.PaymentAbpSelected = null;
  }

  removePaymentMethodEditAutoPayConfirm(): void {
    this.BillingAccountService
      .applyNewAutoBillPay(this.PaymentAbpSelected, this.BillingAccountService.ActiveBillingAccount, true)
      .then(() => {
        this.PaymentMethodService
          .deletePaymentMethod(this.PaymentAbpSelecting.Id)
          .then((PaymentMethods: PaymentMethod[]) => {
            this.PaymentMessage = {
              classes: ['alert', 'alert-success'],
              innerHTML: [
                `<b>Ok!</b> your payment account, ending in <b>${this.PaymentAbpSelecting.Card_Last}</b> was deleted and `,
                `<b>Auto Bill Pay</b> is using your payment account ending in <b>${this.PaymentAbpSelected.Card_Last}</b>!`
              ].join('')
            };
            this.removePaymentMethodEditAutoPayCancel();
            this.PaymentMethods = PaymentMethods;
          });
      });
  }

  removePaymentMethodEditAutoPayCancel(): void {
    this.PaymentEditting = this.PaymentAbpSelecting = null;
  }

  addingCreditCardToggle(open: boolean): void {
    const doOpen = open !== false;
    if (doOpen) {
      this.addingCreditCardFormValid = false;
    }
    this.addingCreditCard = doOpen;
  }

  addingCreditCardFormChanged($event: string): void {
    this.addingCreditCardFormValid = $event === 'valid';
  }

  addingCreditCardSubmit() {
    console.log(this.addCreditCardComponent.formGroup.value);
    alert('Add card to Forte now.\nCheck the console for the user\'s input.');
    this.addingCreditCard = false;
  }

  addingEcheckToggle(open: boolean): void {
    const doOpen = open !== false;
    if (doOpen) {
      this.addingEcheckFormValid = false;
    }
    this.addingEcheck = doOpen;
  }

  addingEcheckFormChanged($event: string): void {
    this.addingEcheckFormValid = $event === 'valid';
  }

  addingEcheckSubmit() {
    console.log(this.addEcheckComponent.formGroup.value);
    alert('Add Echeck now.\nCheck the console for the user\'s input.');
    this.addingEcheck = false;
  }

}
