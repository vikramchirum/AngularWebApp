import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy, AfterViewInit  {
  public IsInRenewalTimeFrame: boolean;
  ActiveBillingAccountDetails: BillingAccountClass;
  billingAccountSubscription: Subscription;

  constructor(private billingAccount_service: BillingAccountService) {
    this.IsInRenewalTimeFrame = false;

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
  }

}
