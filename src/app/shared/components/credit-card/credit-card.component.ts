import { Component, OnInit, Input } from '@angular/core';

import { PaymentMethod } from 'app/core/PaymentMethod';

@Component({
  selector: 'mygexa-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {

  @Input() PaymentMethod: PaymentMethod = null;
  @Input() Inactive: boolean = null;

  constructor() {}

  ngOnInit() {}

  /**
   * Returns the Font Awesome tag or a general credit card icon.
   * @returns {string}
   */
  getFontAwesomeTag(): string {
    switch (this.PaymentMethod.Card_Brand) {
      case 'amex': return 'cc-amex';
      case 'diners-club': return 'cc-diners-club';
      case 'discover': return 'cc-discover';
      case 'jcb': return 'cc-jcb';
      case 'mastercard': return 'cc-mastercard';
      case 'paypal': return 'cc-paypal';
      case 'stripe': return 'cc-stripe';
      case 'visa': return 'cc-visa';
    }
    return 'credit-card';
  }

}
