import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  IsInRenewalTimeFrame: boolean;
  billingAccountSubscription: Subscription;

  constructor(private billingAccount_service: BillingAccountService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        console.log('Billing Account', result);
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
  }
}
