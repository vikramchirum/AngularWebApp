import { Component, OnDestroy, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { get, result } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  IsInRenewalTimeFrame: boolean = null;
  ActiveServiceAccount: ServiceAccount = null;
  ActiveServiceAccountSubscription: Subscription = null;

  public doughnutChartDataSet: Observable<any[]> = Observable.of([]);

  @ViewChild('gaugeText') gaugeText;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {

        if (get(ActiveServiceAccount, 'Is_In_Holdover', false)) {
          this.buildHoldoverChart();
        } else {
          this.buildChart(
            new Date(ActiveServiceAccount.Contract_Start_Date),
            new Date(),
            ActiveServiceAccount.Contract_End_Date
              ? new Date(ActiveServiceAccount.Contract_End_Date)
              : new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 90))
          );
        }

        this.ActiveServiceAccount = ActiveServiceAccount;
        this.IsInRenewalTimeFrame = ActiveServiceAccount.IsUpForRenewal;
        this.ChangeDetectorRef.detectChanges();
      });

  }

  buildChart(Start_Date: Date, Today: Date, End_Date: Date): void {

    const start_Date_Time = Start_Date.getTime();
    const today_Time = Today.getTime();
    const end_Date_Time = End_Date.getTime();

    const day = 24 * 60 * 60 * 1000;

    const totalDaysOfContract = Math.round(Math.abs((end_Date_Time - start_Date_Time) / day));
    const totalDaysUsed = Math.round(Math.abs((today_Time - start_Date_Time) / day));
    const totalTimeRemaining = Math.round(Math.abs((end_Date_Time - today_Time) / day));

    const percentage = Math.round((totalTimeRemaining * 100) / totalDaysOfContract);
    const weightedSections = Math.round(((totalDaysOfContract * 0.05) * 100) / (totalDaysOfContract + 90));

    this.doughnutChartDataSet = Observable.of([
      Math.round((totalDaysUsed * 100) / (totalDaysOfContract + 90)), // Blue bar
      Math.round((totalTimeRemaining * 100) / (totalDaysOfContract + 90)), // Green Bar
      weightedSections, // Yellow Bar
      weightedSections // Red Bar
    ]);

    try {
      const gaugeText = this.gaugeText.nativeElement.getContext('2d');
      gaugeText.clearRect(0, 0, 1000, 1000);
      gaugeText.textAlign = 'center';
      gaugeText.fillStyle = 'black';

      gaugeText.font = 'bold 150pt sans-serif';
      gaugeText.fillText(`${percentage}%`, 500, 400);

      gaugeText.font = 'bold 40pt sans-serif';
      gaugeText.fillText('of Contract Time', 500, 500);
      gaugeText.fillText('Remaining', 500, 550);

      gaugeText.font = '60pt sans-serif';
      gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
      if (percentage < 25) {
        gaugeText.fillText('Act Now to Lock', 500, 680);
        gaugeText.fillText('In Savings!', 500, 765);
      } else if (percentage < 50) {
        gaugeText.fillText('Time to Start', 500, 680);
        gaugeText.fillText('Shopping!', 500, 765);
      } else {
        gaugeText.fillText('Your Plan is in', 500, 680);
        gaugeText.fillText('Good Shape!', 500, 765);
      }
    } catch (e) {
      // If thrown, the browser likely does not support the HTML5 canvas API/object.
      console.error(e);
    }
  }

  buildHoldoverChart(): void {

    this.doughnutChartDataSet = Observable.of([0, 1, 0, 0]);

    try {
      const gaugeText = this.gaugeText.nativeElement.getContext('2d');
      gaugeText.clearRect(0, 0, 1000, 1000);
      gaugeText.textAlign = 'center';
      gaugeText.fillStyle = 'black';

      gaugeText.font = 'bold 150pt sans-serif';
      gaugeText.fillText('OK!', 500, 400);

      gaugeText.font = 'bold 40pt sans-serif';
      gaugeText.fillText('Holdover caption', 500, 500);
      gaugeText.fillText('goes here.', 500, 550);

      gaugeText.font = '60pt sans-serif';
      gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
      gaugeText.fillText('Secondary text', 500, 680);
      gaugeText.fillText('goes here!', 500, 765);
    } catch (e) {
      // If thrown, the browser likely does not support the HTML5 canvas API/object.
      console.error(e);
    }
  }

  ngOnDestroy() {
    result(this.ActiveServiceAccountSubscription, 'unsubscribe');
  }

}
