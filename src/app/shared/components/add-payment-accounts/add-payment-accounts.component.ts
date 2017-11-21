import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { get } from 'lodash';

import { PaymethodService } from 'app/core/Paymethod.service';
import { PaymethodAddCcComponent } from '../payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from '../payment-method-add-echeck/payment-method-add-echeck.component';

@Component({
  selector: 'mygexa-add-payment-accounts',
  templateUrl: './add-payment-accounts.component.html',
  styleUrls: ['./add-payment-accounts.component.scss']
})
export class AddPaymentAccountsComponent implements OnInit {

  @ViewChild(PaymethodAddCcComponent)
  private addCreditCardComponent: PaymethodAddCcComponent;

  @ViewChild(PaymethodAddEcheckComponent)
  private addEcheckComponent: PaymethodAddEcheckComponent;

  @Output() public onAddPaymentAccountSubmittedEvent = new EventEmitter<IPaymentMessage>();
  errorFromForte: string = null;
  addingEcheck: boolean = null;
  addingEcheckFormValid: boolean = null;
  addingCreditCard: boolean = null;
  addingCreditCardFormValid: boolean = null;

  paymentMessage: IPaymentMessage = null;

  constructor(private paymethodService: PaymethodService) {
  }

  ngOnInit() {
  }

  addingCreditCardToggle(open: boolean): void {
    this.addingCreditCard = open !== false;
    if (this.addingCreditCard) {
      this.addingCreditCardFormValid = false;
    }
  }

  addingCreditCardFormChanged($event: string): void {
    this.addingCreditCardFormValid = $event === 'valid';
  }

  addingCreditCardSubmit() {

    this.addingCreditCard = false;
    this.paymentMessage = {
      classes: ['alert', 'alert-info'],
      innerHTML: `<i class="fa fa-fw fa-spinner fa-spin"></i> <b>Please wait</b> we're adding your new payment method now.`,
      isCompleted: false
    };
    this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);

    this.paymethodService.AddPaymethodCreditCardFromComponent(this.addCreditCardComponent).subscribe(
      result => {
        const accountNumber = get(result, 'CreditCard.AccountNumber');
        if (accountNumber) {

          this.paymentMessage = {
            classes: ['alert', 'alert-success'],
            innerHTML: `<b>Ok!</b> your credit account, ending in <b>${ accountNumber }</b> has been added as a payment method! <br/> <i class="fa fa-fw fa-spinner fa-spin"> </i> <b>Please Wait!</b> Loading your saved payment methods.`,
            isCompleted: true
          };
          this.errorFromForte = null;
          this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);
        }
        this.paymethodService.UpdatePaymethods();
      },
      error => {
          console.log('Error', error.response_description);
          const errorMessage = String(error.response_description);
          this.errorFromForte = String(error.response_description);
          this.paymentMessage = {
            classes: ['alert', 'alert-danger'],
            innerHTML: `<b>Error occurred!</b> ${ errorMessage }`,
            isCompleted: true
          };
          this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);
      }
    );
  }

  addingEcheckToggle(open: boolean): void {
    this.addingEcheck = open !== false;
    if (this.addingEcheck) {
      this.addingEcheckFormValid = false;
    }
  }

  addingEcheckFormChanged($event: string): void {
    this.addingEcheckFormValid = $event === 'valid';
  }

  addingEcheckSubmit() {
    this.addingEcheck = false;
    this.paymentMessage = {
      classes: ['alert', 'alert-info'],
      innerHTML: `<i class="fa fa-fw fa-spinner fa-spin"></i> <b>Please wait</b> we're adding your new payment method now.`,
      isCompleted: false
    };
    this.errorFromForte = null;
    this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);

    this.paymethodService.AddPaymethodEcheckFromComponent(this.addEcheckComponent).subscribe(
      result => {
        const accountNumber = get(result, 'BankAccount.AccountNumber');
        if (accountNumber) {
          this.paymentMessage = {
            classes: ['alert', 'alert-success'],
            innerHTML: `<b>Ok!</b> your bank account, ending in <b>${ accountNumber }</b> has been added as a payment method! <br/> <i class="fa fa-fw fa-spinner fa-spin"> </i> <b>Please Wait!</b> Loading your saved payment methods.`,
            isCompleted: true
          };
          this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);
        }
        this.paymethodService.UpdatePaymethods();
      }
    );
  }
}
