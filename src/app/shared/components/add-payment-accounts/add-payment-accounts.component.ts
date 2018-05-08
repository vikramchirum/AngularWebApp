import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { get } from 'lodash';

import { PaymethodService } from 'app/core/Paymethod.service';
import { PaymethodAddCcComponent } from '../payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from '../payment-method-add-echeck/payment-method-add-echeck.component';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

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

  constructor(private paymethodService: PaymethodService, private googleAnalyticsService: GoogleAnalyticsService) {
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

    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.PaymentAccounts], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SubmitNewCreditCard]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SubmitNewCreditCard]);

    this.paymentMessage = {
      classes: ['alert', 'alert-info'],
      innerHTML: `<i class="fa fa-fw fa-spinner fa-spin"></i> <b>Please wait</b> we're adding your new payment method now.`,
      isCompleted: false
    };
    this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);

    this.paymethodService.AddPaymethodCreditCardFromComponent(this.addCreditCardComponent).subscribe(
      result => {
        this.addingCreditCard = false;
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
        this.errorFromForte = String(error.response_description);
        let forteErrorMessage = 'it looks like your payment account details are incorrect';
        if (error.response_description === 'The card_number is invalid.') {
          forteErrorMessage = 'it looks like this card number is invalid';
        } else if (error.response_description === 'The expire_month and expire_year are invalid.') {
          forteErrorMessage = 'the expiration date is invalid';
        } else if (error.response_description === 'The cvv is invalid.') {
          forteErrorMessage = 'it looks like this cvv is invalid';
        } else if (error.response_description === 'The routing_number is invalid.') {
          forteErrorMessage = 'it looks like this routing number is invalid';
        } else {
          forteErrorMessage = error.response_description.replace('_', ' ').replace('.', '');
        }
        this.paymentMessage = {
          classes: ['alert', 'alert-danger'],
          innerHTML: `<b>Error occurred!</b> ${ forteErrorMessage }`,
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

    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.PaymentAccounts], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SubmitNewECheck]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SubmitNewECheck]);

    this.paymentMessage = {
      classes: ['alert', 'alert-info'],
      innerHTML: `<i class="fa fa-fw fa-spinner fa-spin"></i> <b>Please wait</b> we're adding your new payment method now.`,
      isCompleted: false
    };
    this.errorFromForte = null;
    this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);

    this.paymethodService.AddPaymethodEcheckFromComponent(this.addEcheckComponent).subscribe(
      result => {
        this.addingEcheck = false;
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
      }, error => {

        this.errorFromForte = String(error.response_description);
        let forteErrorMessage = 'it looks like your payment account details are incorrect';
        if (error.response_description === 'The card_number is invalid.') {
           forteErrorMessage =  'it looks like this card number is invalid';
        } else if (error.response_description === 'The expire_month and expire_year are invalid.') {
           forteErrorMessage =  'the expiration date is invalid';
        } else if (error.response_description === 'The cvv is invalid.') {
           forteErrorMessage =  'it looks like this cvv is invalid';
        } else if (error.response_description === 'The routing_number is invalid.') {
           forteErrorMessage =  'it looks like this routing number is invalid';
        } else {
          forteErrorMessage = error.response_description.replace('_', ' ').replace('.', '');
        }

        this.paymentMessage = {
          classes: ['alert', 'alert-danger'],
          innerHTML: `<b>Error occurred!</b> ${ forteErrorMessage }`,
          isCompleted: true
        };

        this.onAddPaymentAccountSubmittedEvent.emit(this.paymentMessage);
      }
    );
  }
}
