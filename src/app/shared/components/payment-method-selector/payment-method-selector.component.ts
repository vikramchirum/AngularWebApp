
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { PaymethodService } from 'app/core/Paymethod.service';
import { PaymethodClass } from 'app/core/models/Paymethod.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-payment-method-selector',
  templateUrl: './payment-method-selector.component.html',
  styleUrls: ['./payment-method-selector.component.scss']
})
export class PaymethodSelectorComponent implements OnInit, OnDestroy {

  @Input() submitText: string = null;
  @Input() initialPaymethod: PaymethodClass = null;
  @Output() changedPaymethod: EventEmitter<any> =  new EventEmitter<any>();

  PaymethodSelected: PaymethodClass = null;
  private PaymethodSubscription: Subscription = null;
  private _Paymethods: PaymethodClass[] = null;

  constructor(
    private PaymethodService: PaymethodService
  ) { }

  get Paymethods(): PaymethodClass[] { return this._Paymethods; }
  set Paymethods(Paymethods: PaymethodClass[]) {
    this._Paymethods = Paymethods;
    if (
      this.initialPaymethod
      && this.Paymethods.indexOf(this.initialPaymethod) >= 0
    ) {
      this.PaymethodSelected = this.initialPaymethod;
    }
  }

  ngOnInit() {
    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );
  }

  ngOnDestroy() {
    this.PaymethodSubscription.unsubscribe();
  }

  submitPaymethod(): void {
    this.changedPaymethod.emit(this.PaymethodSelected);
  }
}

