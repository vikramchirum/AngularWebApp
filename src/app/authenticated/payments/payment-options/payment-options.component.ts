import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import {ServiceAccount} from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements OnInit, OnDestroy {

  private ActiveServiceAccountSubscription: Subscription = null;

  private _ActiveServiceAccount: ServiceAccount = null;
  get ActiveServiceAccount() { return this._ActiveServiceAccount; }
  set ActiveServiceAccount(ActiveServiceAccount) {
    this._ActiveServiceAccount = ActiveServiceAccount;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    public Router: Router,
    private ServiceAccountService: ServiceAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => this.ActiveServiceAccount = ActiveServiceAccount
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }

}
