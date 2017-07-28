import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';


import { PaymethodService } from 'app/core/Paymethod.service';
import { Paymethod } from 'app/core/models/paymethod/Paymethod.model';
import { Subscription } from 'rxjs/Subscription';
import { find } from 'lodash';
import {ServiceAccount} from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnDestroy, OnInit {

  @Input() Inactive: boolean = null;
  @Input() PaymethodId: number = null;
  @Input() ActiveServiceAccount: ServiceAccount = null;

  private PaymethodsSubscription: Subscription = null;
  private _Paymethod: Paymethod = null;
  get Paymethod() { return this._Paymethod; }
  set Paymethod(Paymethod) {
    this._Paymethod = Paymethod;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    private PaymethodService: PaymethodService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.PaymethodsSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => {
        const targetPaymethod = find(Paymethods, ['PayMethodId', this.ActiveServiceAccount
          ? this.ActiveServiceAccount.PayMethodId
          : this.PaymethodId
        ]);
        if (targetPaymethod) {
          this.Paymethod = targetPaymethod;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.PaymethodsSubscription.unsubscribe();
  }

}
