
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PaymentMethod, PaymentMethodService } from 'app/core/PaymentMethod';

@Component({
  selector: 'mygexa-payment-method-selector',
  templateUrl: './payment-method-selector.component.html',
  styleUrls: ['./payment-method-selector.component.scss']
})
export class PaymentMethodSelectorComponent implements OnInit {

  @Input() submitText: string = null;
  @Input() initialPaymentMethod: PaymentMethod = null;
  @Output() changedPaymentMethod: EventEmitter<any> =  new EventEmitter<any>();

  PaymentMethods: PaymentMethod[] = [];
  PaymentMethodSelected: PaymentMethod = null;

  constructor(
    private PaymentMethodService: PaymentMethodService
  ) { }

  ngOnInit() {
    this.PaymentMethodService.getPaymentMethods()
      .then((PaymentMethods: PaymentMethod[]) => {
        this.PaymentMethods = PaymentMethods;
        if (
          this.initialPaymentMethod
          && this.PaymentMethods.indexOf(this.initialPaymentMethod) >= 0
        ) {
          this.PaymentMethodSelected = this.initialPaymentMethod;
        }
      });
  }

  submitPaymentMethod(): void {
    this.changedPaymentMethod.emit(this.PaymentMethodSelected);
  }
}

