import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { get, result } from 'lodash';
import { RenewalGaugeComponent } from './renewal-gauge/renewal-gauge.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import {RenewalService} from '../../../core/renewal.service';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  public ActiveServiceAccount: ServiceAccount = null;
  ActiveServiceAccountSubscription: Subscription = null;
  RenewalServiceAccountSubscription: Subscription = null;
  @ViewChild(RenewalGaugeComponent) RenewalGaugeComponent;
  public IsUpForRenewal: boolean = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private RenewalService: RenewalService
  ) { }

  ngOnInit() {

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.RenewalServiceAccountSubscription = this.RenewalService.getRenewalDetails(Number(this.ActiveServiceAccount.Id)).subscribe(
          RenewalDetails => { this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
            // Is_In_Holdover needs to be updated to whatever we specify in the API.
            if (RenewalDetails.Is_Account_Eligible_Renewal === false) {
              this.RenewalGaugeComponent.buildRenewedChart(
                new Date(),
                ActiveServiceAccount.Contract_End_Date ? new Date(ActiveServiceAccount.Contract_End_Date) : ActiveServiceAccount.Calculated_Contract_End_Date
              );
            } else if (ActiveServiceAccount.Current_Offer.IsHoldOverRate === true) {
              this.RenewalGaugeComponent.buildHoldoverChart();
            } else {
              this.RenewalGaugeComponent.buildChart(
                new Date(ActiveServiceAccount.Contract_Start_Date),
                new Date(),
                ActiveServiceAccount.Contract_End_Date ? new Date(ActiveServiceAccount.Contract_End_Date) : ActiveServiceAccount.Calculated_Contract_End_Date
              );
            }
          });
      }
    );
  }

  ngOnDestroy() {
    result(this.ActiveServiceAccountSubscription, 'unsubscribe');
    result(this.RenewalServiceAccountSubscription, 'unsubscribe');
  }

  get hideGauge(): boolean {
    return (
      this.ActiveServiceAccount
      && !this.ActiveServiceAccount.Current_Offer.IsHoldOverRate
      && ((this.ActiveServiceAccount.Contract_End_Date ? this.ActiveServiceAccount.Contract_End_Date : this.ActiveServiceAccount.Calculated_Contract_End_Date) < new Date()));
  }

}
