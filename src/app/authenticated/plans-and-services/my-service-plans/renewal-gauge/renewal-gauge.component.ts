import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {isFunction} from 'lodash';
import {RenewalStore} from '../../../../core/store/RenewalStore';
import {ServiceAccountService} from '../../../../core/serviceaccount.service';
import {ServiceAccount} from '../../../../core/models/serviceaccount/serviceaccount.model';
import {IRenewalDetails} from '../../../../core/models/renewals/renewaldetails.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-renewal-gauge',
  templateUrl: './renewal-gauge.component.html',
  styleUrls: ['./renewal-gauge.component.scss']
})
export class RenewalGaugeComponent implements OnInit, OnDestroy {

  @ViewChild('gaugeText') gaugeText;
  plansServicesSubscription: Subscription;

  public doughnutChartOptions: any = Observable.of({});
  public doughnutChartDataSet: Observable<any[]> = Observable.of([0, 0, 0, 0]);
  public clearTimeout = null;
  public clearIsDone = null;
  public chartTimestamp: Date = null;
  public chartType: string = null;

  constructor(private serviceAccountService: ServiceAccountService, private renewalStore: RenewalStore) {
    this.doughnutChartOptions = Observable.of({
      cutoutPercentage: 80,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {

            if (this.chartType === 'holdover') {
              return 'Plan Time Remaining';
            }

            if (this.chartType === 'renewal') {
              return 'Plan Time Remaining';
            }

            return [
              ' Plan Time Used',
              ' Plan Time Remaining',
              ' 30 Days Remaining',
              ' 15 Days Remaining'
            ][tooltipItem.index];
          }
        }
      }
    });
  }

  ngOnInit() {
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinctUntilChanged(null, x => x[1].Service_Account_Id).subscribe(result => {

      this.LoadGauge(result[0], result[1]);
    });
  }

  clearFirst(callback: Function) {

    // If we haven't yet drawn any charts, have no delay on the initial.
    const delay = this.clearIsDone === null ? 0 : 1000;

    this.chartTimestamp = null;
    this.clearIsDone = false;

    // Stop any previous jobs/timeouts.
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }

    // Clear the doughnut chart (starting its' animation.)
    this.doughnutChartDataSet = Observable.of([0, 0, 0, 0]);

    // Try to clear the gauge's text.
    try {
      this.prepareTextCanvas();
    } catch (e) {
      // If thrown, the browser likely does not support the HTML5 canvas API/object.
      console.error(e);
    }

    // Run the callback after the delay (once the animation has finished.)
    this.clearTimeout = setTimeout(() => {
      this.clearIsDone = true;

      if (isFunction(callback)) {
        callback();
      }
    }, delay);

  }

  prepareTextCanvas() {
    const gaugeText = this.gaugeText.nativeElement.getContext('2d');
    gaugeText.clearRect(0, 0, 1000, 1000);
    gaugeText.textAlign = 'center';

    return gaugeText;
  }

  buildChart(Start_Date: Date, Today: Date, End_Date: Date): void {

    this.chartType = 'standard';

    this.clearFirst(() => {

      const timestamp = this.chartTimestamp = new Date;

      const start_Date_Time = Start_Date.getTime();
      const today_Time = Today.getTime();
      const end_Date_Time = End_Date.getTime();
      const aDay = 24 * 60 * 60 * 1000;

      console.log('arguments', Start_Date, Today, End_Date);

      const totalDaysOfContract = Math.round(Math.abs((end_Date_Time - start_Date_Time) / aDay));
      const totalDaysUsed = Math.round(Math.abs((today_Time - start_Date_Time) / aDay));
      const totalTimeRemaining = totalDaysOfContract - totalDaysUsed;
      const percentageOfTimeRemaining = Math.round((totalTimeRemaining * 100) / totalDaysOfContract);
      const renewalWindow = 30;
      // Hard-code in values for testing.
      // const totalDaysOfContract: number = 100;
      // const totalDaysUsed: number = 1;
      // const totalTimeRemaining: number = totalDaysOfContract - totalDaysUsed;
      // const percentageOfTimeRemaining = Math.round((totalTimeRemaining * 100) / totalDaysOfContract);
      // const renewalWindow: number = 30;

      if (totalTimeRemaining <= renewalWindow - 15) {
        // 15 days or less remain - show blue bar touching the red.
        this.doughnutChartDataSet = Observable.of([95, 0, 0, 5]);
      } else if (totalTimeRemaining <= renewalWindow) {
        // 30 days or less remain - show blue bar touching the yellow and red.
        this.doughnutChartDataSet = Observable.of([90, 0, 5, 5]);
      } else {
        // Plenty of time remains - show a weighted percentage of the blue vs green bars.
        const preRenewalWindow = totalDaysOfContract - renewalWindow;
        const weightedUsed = Math.round((totalDaysUsed * 90) / preRenewalWindow);
        this.doughnutChartDataSet = Observable.of([weightedUsed, 90 - weightedUsed, 5, 5]);
      }

      try {
        const gaugeText = this.prepareTextCanvas();

        // Print out the message according to the short-term window.
        gaugeText.font = '50pt sans-serif';
        gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
        if (totalTimeRemaining <= 30) {
          gaugeText.fillText('Lock in A', 500, 660);
          gaugeText.fillText('New Fixed Rate!', 500, 745);
        } else if (totalTimeRemaining <= 90) {
          gaugeText.fillText('It’s Time To', 500, 660);
          gaugeText.fillText('Renew Your Plan!', 500, 745);
        } else {
          gaugeText.fillText('Your Plan is in', 500, 660);
          gaugeText.fillText('Good Shape!', 500, 745);
        }

        gaugeText.fillStyle = 'black';
        if (totalTimeRemaining <= 30) {
          gaugeText.font = 'bold 40pt sans-serif';
          gaugeText.fillText(`Day${totalTimeRemaining === 1 ? '' : 's'} of Your`, 500, 500);
          gaugeText.fillText('Contract Remaining', 500, 550);

          gaugeText.font = 'bold 150pt sans-serif';
          const renderDays = (day) => {
            // Continue only if the this component's chartTimestamp is still this scope's timestamp.
            // If this condition is no longer met then another chart has been started for another activated service account.
            if (timestamp === this.chartTimestamp) {
              gaugeText.clearRect(0, 200, 1000, 250);
              gaugeText.fillText(`${day}`, 500, 400);

              if (++day <= totalTimeRemaining) {
                // Using setTimeout because requestAnimationFrame may be too fast.
                setTimeout(() => renderDays(day), 75);
              }
            }
          };
          renderDays(0);
        } else {
          gaugeText.font = 'bold 150pt sans-serif';
          gaugeText.fillText(`${percentageOfTimeRemaining}%`, 500, 400);

          gaugeText.font = 'bold 40pt sans-serif';
          gaugeText.fillText('of Contract Time', 500, 500);
          gaugeText.fillText('Remaining', 500, 550);
        }
      } catch (e) {
        // If thrown, the browser likely does not support the HTML5 canvas API/object.
        console.error(e);
      }
    });

  }

  buildRenewedChart(Today: Date, Start_Date: Date): void {
    this.chartType = 'renewed';

    this.clearFirst(() => {

      // Keep aside a timestamp to tell if we've stopped the later animation.
      const timestamp = this.chartTimestamp = new Date;

      // Show a completely green chart.
      this.doughnutChartDataSet = Observable.of([0, 1, 0, 0]);

      // Calculate the amount of days between now and the start date of the new contract.
      const start_Date_Time = Start_Date.getTime();
      const today_Time = Today.getTime();
      const daysLeft = Math.round(Math.abs((start_Date_Time - today_Time) / (24 * 60 * 60 * 1000)));

      try {
        const gaugeText = this.prepareTextCanvas();

        gaugeText.font = '60pt sans-serif';
        gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
        gaugeText.fillText('Until your', 500, 600);
        gaugeText.fillText('new plan starts', 500, 685);

        gaugeText.fillStyle = 'black';
        gaugeText.font = 'bold 45pt sans-serif';
        gaugeText.fillText('Only', 500, 330);

        gaugeText.font = 'bold 100pt sans-serif';
        const renderDays = (day) => {
          // Continue only if the this component's chartTimestamp is still this scope's timestamp.
          // If this condition is no longer met then another chart has been started for another activated service account.
          if (timestamp === this.chartTimestamp) {
            gaugeText.clearRect(0, 375, 1000, 150);
            gaugeText.fillText(`${day} Day${daysLeft === 1 ? '' : 's'}`, 500, 480);

            if (++day <= daysLeft) {
              requestAnimationFrame(() => renderDays(day));
            }
          }
        };
        renderDays(0);

      } catch (e) {
        // If thrown, the browser likely does not support the HTML5 canvas API/object.
        console.error(e);
      }

    });

  }

  buildHoldoverChart(): void {

    this.chartType = 'holdover';

    this.clearFirst(() => {

      // Show a completely green chart.
      this.doughnutChartDataSet = Observable.of([0, 1, 0, 0]);

      try {
        const gaugeText = this.prepareTextCanvas();
        gaugeText.fillStyle = 'black';

        gaugeText.font = 'bold 100pt sans-serif';
        gaugeText.fillText('All Set!', 500, 475);

        gaugeText.font = '50pt sans-serif';
        gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
        gaugeText.fillText('No Expiration Date', 500, 580);
        gaugeText.fillText('on your plan', 500, 670);
      } catch (e) {
        // If thrown, the browser likely does not support the HTML5 canvas API/object.
        console.error(e);
      }
    });
  }

  LoadGauge(activeServiceAccount: ServiceAccount, renewal_details: IRenewalDetails) {

    // Is_In_Holdover needs to be updated to whatever we specify in the API.
    if (renewal_details.Existing_Renewal && renewal_details.Existing_Renewal.Is_Pending == true) {
      this.buildRenewedChart(
        new Date(),
        activeServiceAccount.Contract_End_Date ? new Date(activeServiceAccount.Contract_End_Date) : activeServiceAccount.Calculated_Contract_End_Date
      );
    }
    else if (activeServiceAccount.Current_Offer.IsHoldOverRate === true) {
      this.buildHoldoverChart();
    }
    else {
      this.buildChart(
        new Date(activeServiceAccount.Contract_Start_Date),
        new Date(),
        activeServiceAccount.Contract_End_Date ? new Date(activeServiceAccount.Contract_End_Date) : activeServiceAccount.Calculated_Contract_End_Date
      );
    }
  }

  ngOnDestroy() {
    this.plansServicesSubscription.unsubscribe();
  }
}
