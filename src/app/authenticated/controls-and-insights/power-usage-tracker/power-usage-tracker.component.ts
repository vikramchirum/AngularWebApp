import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { UsageComparison } from '../../../core/models/usage/usage-comparison.model';

@Component({
  selector: 'mygexa-power-usage-tracker',
  templateUrl: './power-usage-tracker.component.html',
  styleUrls: ['./power-usage-tracker.component.scss']
})
export class PowerUsageTrackerComponent implements OnDestroy {

  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountSubscription: Subscription = null;

  public usageComparison: UsageComparison;
  public usagePrediction: UsageComparison;

  public percentageDifference: number;
  public isDataAvailable: boolean = false;
  public daysInLastCycle: number;
  
  constructor(
    private ServiceAccountService: ServiceAccountService,
    private usageHistoryService: UsageHistoryService
  ) { 
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.getUsageComparisonByUAN();
      }
    )
  }

  getUsageComparisonByUAN() {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsageComparison(this.activeServiceAccount.UAN)
        .subscribe(usageComparison => {
          this.usageComparison = usageComparison;
          this.getUsagePredictionForCurrentMonth(usageComparison.Meter_Read_Cycles[1].End_Date);
          this.calculateDaysInLastCycle();
          this.isDataAvailable = true;
        });
    }
  }

  getUsagePredictionForCurrentMonth(endDate: Date) {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsagePrediction(this.activeServiceAccount.UAN, endDate).subscribe(usagePreduction => {
        this.usagePrediction = usagePreduction;
        this.calculatePercentDifference();
      });
    }
  }

  getStyle(number: number): string {
    if (number < 0) {
      return 'red';
    } else {
      return '#2eb134'; // green
    }
  }

  getBgColor(): string {
    if (this.usageComparison.Meter_Read_Cycles[0].Usage < this.usageComparison.Meter_Read_Cycles[1].Usage) {
      return 'red';
    } else {
      return '#2eb134'; // green
    }
  }

  getWidth(cycleIndex: number): string {
    switch (cycleIndex) {
      case 0:
        if (this.usageComparison.Meter_Read_Cycles[0].Usage < this.usageComparison.Meter_Read_Cycles[1].Usage) {
          return '55%';
        } else {
          return '85%';
        }
      case 1:
        if (this.usageComparison.Meter_Read_Cycles[0].Usage < this.usageComparison.Meter_Read_Cycles[1].Usage) {
          return '85%';
        } else {
          return '55%';
        }
    }
  }

  ngOnDestroy() {
    this.ServiceAccountSubscription.unsubscribe();
  }

  private calculatePercentDifference(): void {
    const diff = this.usageComparison.Meter_Read_Cycles[1].Usage / this.usagePrediction.Meter_Read_Cycles[0].Usage;
    if (isNaN(diff)) {
      this.percentageDifference = 0;
    } else {
      if (diff < 100) {
        this.percentageDifference = Math.round(diff * 100);
      } else {
        this.percentageDifference = Math.round(-Math.abs(diff * 100 - 100));
      }
    }
  }

  private calculateDaysInLastCycle(): void {
    const date2 = new Date(this.usageComparison.Meter_Read_Cycles[0].End_Date);
    const date1 = new Date(this.usageComparison.Meter_Read_Cycles[0].Start_Date);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.daysInLastCycle = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

}
