import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RenewalGaugeComponent } from './renewal-gauge/renewal-gauge.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from '../../../core/store/RenewalStore';
import { IRenewalDetails } from '../../../core/models/renewals/renewaldetails.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  @ViewChild(RenewalGaugeComponent) RenewalGaugeComponent;
  plansServices$: Observable<[ServiceAccount, IRenewalDetails]>;

  constructor(private serviceAccountService: ServiceAccountService, private renewalStore: RenewalStore) {
  }

  ngOnInit() {
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServices$ = Observable.combineLatest(activeServiceAccount$, renewalDetails$);
  }

  hideGauge(activeServiceAccount: ServiceAccount): boolean {
    return (!activeServiceAccount.Current_Offer.IsHoldOverRate
    && ((activeServiceAccount.Contract_End_Date ? activeServiceAccount.Contract_End_Date : activeServiceAccount.Calculated_Contract_End_Date) < new Date()));
  }

  ngOnDestroy() {
  }
}
