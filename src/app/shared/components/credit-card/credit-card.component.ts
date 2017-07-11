import { Component, Input } from '@angular/core';

import { PaymethodClass } from 'app/core/models/Paymethod.model';

@Component({
  selector: 'mygexa-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {

  @Input() Paymethod: PaymethodClass = null;
  @Input() Inactive: boolean = null;

  constructor() {}

}
