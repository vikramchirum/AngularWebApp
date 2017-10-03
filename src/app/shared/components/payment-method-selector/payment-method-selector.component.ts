import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { get } from 'lodash';

import { Subscription } from 'rxjs/Subscription';

import { PaymethodService } from 'app/core/Paymethod.service';
import { Paymethod } from 'app/core/models/paymethod/Paymethod.model';
import { PaymethodAddCcComponent } from '../payment-method-add-cc/payment-method-add-cc.component';

@Component({
  selector: 'mygexa-payment-method-selector',
  templateUrl: './payment-method-selector.component.html',
  styleUrls: ['./payment-method-selector.component.scss']
})
export class PaymethodSelectorComponent implements OnInit, OnDestroy {

  @Input() disableIfOnlyOne: boolean = null;
  @Input() disableIfOnlyOneText: string = null;
  @Input() headerText: string = null;
  @Input() cancelText: string = null;
  @Input() cancelProvide: boolean = null;
  @Input() submitText: string = null;
  @Input() initialPaymethod: Paymethod = null;
  @Input() initialPaymethodDisable: boolean = null;
  @Output() canceledSelect: EventEmitter<any> =  new EventEmitter<any>();
  @Output() changedPaymethod: EventEmitter<any> =  new EventEmitter<any>();

  @ViewChild(PaymethodAddCcComponent)
  private addCreditCardComponent: PaymethodAddCcComponent;
  PaymentMessage: IPaymentMessage = null;
  addingCreditCardFormValid: boolean = null;
  addingCreditCard: boolean = null;

  PaymethodSelected: Paymethod = null;
  private PaymethodSubscription: Subscription = null;
  private _Paymethods: Paymethod[] = null;

  constructor(
    private PaymethodService: PaymethodService
  ) { }

  get Paymethods(): Paymethod[] { return this._Paymethods; }
  set Paymethods(Paymethods: Paymethod[]) {
    this._Paymethods = Paymethods;
    if (
      this.initialPaymethod
      && this.Paymethods.indexOf(this.initialPaymethod) >= 0
    ) {
      this.PaymethodSelected = this.initialPaymethod;
    }
  }

  ngOnInit() {
    this.initialize();
  }

  private initialize() {
    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => {
        this.Paymethods = Paymethods;
      }
    );
  }

  submitPaymethod(): void {
    this.changedPaymethod.emit(this.PaymethodSelected);
  }

  cancelSelect(): void {
    this.canceledSelect.emit();
  }

  // Ability to Add a new Credit Card from payment options if the payment accounts are null.
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
            innerHTML: `<b>Ok!</b> your credit account, ending in <b>${ accountNumber }</b> has been added as a payment method! <br/> <b>Please Wait!</b> Loading your saved payment methods.`
          };
        }
        this.PaymethodService.UpdatePaymethods();
      }
    );
  }

  ngOnDestroy() {
    this.PaymethodSubscription.unsubscribe();
  }
}
