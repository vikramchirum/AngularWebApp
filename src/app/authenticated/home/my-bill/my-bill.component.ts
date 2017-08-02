/**
 * Created by vikram.chirumamilla on 7/31/2017.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import {environment} from 'environments/environment';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-bill',
  templateUrl: './my-bill.component.html',
  styleUrls: ['./my-bill.component.scss']
})
export class MyBillComponent implements OnInit, OnDestroy {
  dollarAmountFormatter: string;
  activeServiceAccount: ServiceAccount;
  private ActiveServiceAccountSubscription: Subscription = null;

  constructor(
    private ServiceAccountService: ServiceAccountService
  ) { }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.activeServiceAccount = result;
      }
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
