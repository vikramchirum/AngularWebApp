import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mygexa-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {

  classes: string[] = ['credit-card-container'];
  fontAwesomeTags: string = null;

  @Input() Brand: string = null;
  @Input() Inactive: boolean = null;
  @Input() Last: string = null;
  @Input() Name: string = null;
  @Input() Type: string = null;

  constructor() {}

  ngOnInit() {
    this.fontAwesomeTags = `fa fa-fw pull-right fa-${this.getFontAwesomeTag()}`;
  }

  /**
   * Returns the Font Awesome tag or a general credit card icon.
   * @returns {string}
   */
  getFontAwesomeTag(): string {
    switch (this.Brand) {
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
