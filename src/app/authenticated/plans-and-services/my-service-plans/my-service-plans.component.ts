import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {Subscription} from 'rxjs/Subscription';
import {ServiceAccount} from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy, AfterViewInit  {
  public IsInRenewalTimeFrame: boolean;
  ActiveServiceAccountDetails: ServiceAccount;
  serviceAccountSubscription: Subscription;

  constructor(private serviceAccount_service: ServiceAccountService) {
    this.IsInRenewalTimeFrame = false;

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.serviceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  ngOnDestroy() {
    this.serviceAccountSubscription.unsubscribe();
  }

}
