import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from '../../../core/store/RenewalStore';
import { IRenewalDetails } from '../../../core/models/renewals/renewaldetails.model';
import { RenewalGaugeComponent } from 'app/authenticated/plans-and-services/my-service-plans/renewal-gauge/renewal-gauge.component';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  @ViewChild(RenewalGaugeComponent) RenewalGaugeComponent;
  plansServices$: Observable<[ServiceAccount, IRenewalDetails]>;

  constructor(private serviceAccountService: ServiceAccountService,
              private renewalStore: RenewalStore) {
  }

  ngOnInit() {
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServices$ = Observable.combineLatest(activeServiceAccount$, renewalDetails$);
  }

  LoadGauge(activeServiceAccount: ServiceAccount, renewal_details: IRenewalDetails) {
    // Is_In_Holdover needs to be updated to whatever we specify in the API.
    if (renewal_details.Is_Account_Eligible_Renewal === false) {
      this.RenewalGaugeComponent.buildRenewedChart(
        new Date(),
        activeServiceAccount.Contract_End_Date ? new Date(activeServiceAccount.Contract_End_Date) : activeServiceAccount.Calculated_Contract_End_Date
      );
    } else if (activeServiceAccount.Current_Offer.IsHoldOverRate === true) {
      this.RenewalGaugeComponent.buildHoldoverChart();
    } else {
      this.RenewalGaugeComponent.buildChart(
        new Date(activeServiceAccount.Contract_Start_Date),
        new Date(),
        activeServiceAccount.Contract_End_Date ? new Date(activeServiceAccount.Contract_End_Date) : activeServiceAccount.Calculated_Contract_End_Date
      );
    }
  }

  hideGauge(activeServiceAccount: ServiceAccount): boolean {
    console.log((!activeServiceAccount.Current_Offer.IsHoldOverRate
    && ((activeServiceAccount.Contract_End_Date ? activeServiceAccount.Contract_End_Date : activeServiceAccount.Calculated_Contract_End_Date) < new Date())));

    return (!activeServiceAccount.Current_Offer.IsHoldOverRate
    && ((activeServiceAccount.Contract_End_Date ? activeServiceAccount.Contract_End_Date : activeServiceAccount.Calculated_Contract_End_Date) < new Date()));
  }

  ngOnDestroy() {
  }
}
