import { Component, OnDestroy, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { forEach, pull, random, result } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  IsInRenewalTimeFrame: boolean = null;
  ActiveServiceAccountDetails: ServiceAccount;
  ActiveServiceAccountSubscription: Subscription;

  public doughnutChartDataSet: Observable<any[]> = Observable.of([]);
  public doughnutChartColors: any[] = [ { backgroundColor: ['rgba(6,81,128,1.0)', 'rgba(46,177,52,1.0)', 'rgba(254,162,32,1.0)', 'red'] } ];
  public doughnutChartLabels: string[] = ['Time Used', 'Time Remaining', 'Enroll Time', 'Renew Time'];

  @ViewChild('gaugeText') gaugeText;

  // temp
  private chartObservers: Observer<any>[] = [];
  private chartTotalDays = 180;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.IsInRenewalTimeFrame = false;

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.ActiveServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
        this.ChangeDetectorRef.detectChanges();
      });

    this.doughnutChartDataSet = Observable.create(observer => {

      this.chartObservers.push(observer);

      observer.next([null, null, null, null]);

      return () => pull(this.chartObservers, observer);

    });

    setTimeout(() => this.tempGenerate(), 100);

  }

  tempSetDays(): void {
    const days = prompt('Enter the contract\'s days:', this.chartTotalDays.toString());
    if (!days) {
      return;
    }
    const daysNumber = Number(days);
    if (!daysNumber) {
      return;
    }
    if (daysNumber > 90) {
      this.chartTotalDays = daysNumber;
      this.tempGenerate();
    }
  }

  tempGenerate(): void {

    const timeUsed = random(1, ((this.chartTotalDays - 90) - 1));

    const timeRemaining = this.chartTotalDays - timeUsed;
    const timeToEnroll = timeRemaining - 90;

    const percentage = Math.round((timeRemaining * 100) / this.chartTotalDays);

    forEach(this.chartObservers, observer => observer.next([
      timeUsed, timeToEnroll, 75, 15
    ]));

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

  }

  ngOnDestroy() {
    result(this.ActiveServiceAccountSubscription, 'unsubscribe');
  }

}
