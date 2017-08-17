import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { get, result } from 'lodash';
import { RenewalGaugeComponent } from './renewal-gauge/renewal-gauge.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  ActiveServiceAccount: ServiceAccount = null;
  ActiveServiceAccountSubscription: Subscription = null;
  public Contract_End_Date: Date;

  @ViewChild(RenewalGaugeComponent) RenewalGaugeComponent;

  constructor(
    private ServiceAccountService: ServiceAccountService
  ) { }

  ngOnInit() {

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {

        this.ActiveServiceAccount = ActiveServiceAccount;

        // if (this.ActiveServiceAccount.Contract_End_Date === null) {
        //   this.Contract_End_Date = this.getEndDate(this.ActiveServiceAccount.Contract_Start_Date, Number(this.ActiveServiceAccount.Current_Offer.Term));
        // }

        // Has_Renewed needs to be updated to whatever we specify in the API.
        // Is_In_Holdover needs to be updated to whatever we specify in the API.
        if (get(ActiveServiceAccount, 'Has_Renewed', false)) {
          this.RenewalGaugeComponent.buildRenewedChart(
            new Date(),
            this.Contract_End_Date
          );
        } else if (ActiveServiceAccount.IsOnHoldOver === true) {
          this.RenewalGaugeComponent.buildHoldoverChart();
        } else {
          this.RenewalGaugeComponent.buildChart(
            new Date(ActiveServiceAccount.Contract_Start_Date),
            new Date(),
            ActiveServiceAccount.Calculated_Contract_End_Date
            //this.Contract_End_Date ? new Date(ActiveServiceAccount.Contract_End_Date) : new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 90))
            //ActiveServiceAccount.Contract_End_Date ? new Date(ActiveServiceAccount.Contract_End_Date) : new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 90))
          );
        }
      }
    );

  }

  ngOnDestroy() {
    result(this.ActiveServiceAccountSubscription, 'unsubscribe');
  }

  getEndDate(startDate, term: number ): Date {
    startDate = new Date(startDate);
    return new Date(new Date(startDate).setMonth(startDate.getMonth() + term ));
  }

  get hideGauge(): boolean {
    // let endDate: Date;
    // if (this.ActiveServiceAccount.Contract_End_Date != null) {
    //   endDate = new Date(this.ActiveServiceAccount.Contract_End_Date);
    // } else {
    //   endDate = this.Contract_End_Date;
    // }
    return (
      this.ActiveServiceAccount
      && !this.ActiveServiceAccount.IsOnHoldOver
      && this.ActiveServiceAccount.Calculated_Contract_End_Date < new Date()
    );
  }

}
