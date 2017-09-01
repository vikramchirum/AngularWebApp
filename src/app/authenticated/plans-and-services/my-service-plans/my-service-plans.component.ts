import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { get, result } from 'lodash';

import { RenewalGaugeComponent } from './renewal-gauge/renewal-gauge.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { RenewalStore } from '../../../core/store/RenewalStore';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  renewalStoreSubscription: Subscription;

  public ActiveServiceAccount: ServiceAccount = null;
  ActiveServiceAccountSubscription: Subscription = null;
  @ViewChild(RenewalGaugeComponent) RenewalGaugeComponent;
  public IsUpForRenewal: boolean = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private renewalStore: RenewalStore
  ) { }

  ngOnInit() {


    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;


        this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(

          RenewalDetails => {

            if (RenewalDetails == null) {
              return;
            }

            this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
            // Is_In_Holdover needs to be updated to whatever we specify in the API.
            if (RenewalDetails.Is_Account_Eligible_Renewal === false) {
              this.RenewalGaugeComponent.buildRenewedChart(
                new Date(),
                this.ActiveServiceAccount.Contract_End_Date ? new Date(this.ActiveServiceAccount.Contract_End_Date) : this.ActiveServiceAccount.Calculated_Contract_End_Date
              );
            } else if (this.ActiveServiceAccount.Current_Offer.IsHoldOverRate === true) {
              this.RenewalGaugeComponent.buildHoldoverChart();
            } else {
              this.RenewalGaugeComponent.buildChart(
                new Date(this.ActiveServiceAccount.Contract_Start_Date),
                new Date(),
                this.ActiveServiceAccount.Contract_End_Date ? new Date(this.ActiveServiceAccount.Contract_End_Date) : this.ActiveServiceAccount.Calculated_Contract_End_Date
              );
            }
          }

        );

      }
    );
  }

  ngOnDestroy() {
    this.renewalStoreSubscription.unsubscribe();
    result(this.ActiveServiceAccountSubscription, 'unsubscribe');
  }

  get hideGauge(): boolean {
    return (
      this.ActiveServiceAccount
      && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate
      && ((this.ActiveServiceAccount.Contract_End_Date ? this.ActiveServiceAccount.Contract_End_Date : this.ActiveServiceAccount.Calculated_Contract_End_Date) < new Date()));
  }

}
