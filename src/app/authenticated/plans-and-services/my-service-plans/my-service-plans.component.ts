import { AfterViewInit, Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy, AfterViewInit  {

  IsInRenewalTimeFrame: boolean = null;
  ActiveServiceAccountDetails: ServiceAccount;
  ActiveServiceAccountSubscription: Subscription;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.IsInRenewalTimeFrame = false;
  }

  ngAfterViewInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
        this.ChangeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }

}
