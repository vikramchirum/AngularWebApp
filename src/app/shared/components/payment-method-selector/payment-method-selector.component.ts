import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { PaymethodService } from 'app/core/Paymethod.service';
import { Paymethod } from 'app/core/models/paymethod/Paymethod.model';

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

  PaymentMessage: IPaymentMessage = null;
  PaymethodSelected: Paymethod = null;
  private PaymethodSubscription: Subscription = null;
  private _Paymethods: Paymethod[] = null;

  constructor(private PaymethodService: PaymethodService) {
  }

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

  handleAddPaymentAccountSubmittedEvent(event: IPaymentMessage) {
  this.PaymentMessage = event;
}

  ngOnDestroy() {
    this.PaymethodSubscription.unsubscribe();
  }
}
