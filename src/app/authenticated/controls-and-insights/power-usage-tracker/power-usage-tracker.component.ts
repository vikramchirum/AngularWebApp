import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { takeRight, values } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { UsageComparison } from '../../../core/models/usage/usage-comparison.model';
import { ValueTransformer } from '@angular/compiler/src/util';

@Component({
  selector: 'mygexa-power-usage-tracker',
  templateUrl: './power-usage-tracker.component.html',
  styleUrls: ['./power-usage-tracker.component.scss']
})
export class PowerUsageTrackerComponent implements OnDestroy {

  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountSubscription: Subscription = null;

  private comparisonStartDate: Date;
  private comparisonEndDate: Date;

  public usageComparison: UsageComparison;
  public usagePrediction: UsageComparison;

  public percentageIncrease: number;
  public daysInLastCycle: number;
  public remainingCycleDays: number;
  public isDataAvailable: boolean = false;
  
  constructor(
    private ServiceAccountService: ServiceAccountService,
    private usageHistoryService: UsageHistoryService
  ) { 
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.getUsageComparisonByUAN();
        this.isDataAvailable = true;
      }
    )
  }

  ngOnDestroy() {
    this.ServiceAccountSubscription.unsubscribe();
  }

  getUsageComparisonByUAN() {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsageComparison(this.activeServiceAccount.UAN)
        .subscribe(usageComparison => {
          this.usageComparison = usageComparison;
          this.getUsagePredictionForCurrentMonth(usageComparison.Meter_Read_Cycles[1].End_Date);
          this.completeCalculations();
        });
    }
  }

  getUsagePredictionForCurrentMonth(endDate: Date) {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsagePrediction(this.activeServiceAccount.UAN, endDate).subscribe(usagePreduction => {
        this.usagePrediction = usagePreduction;
        this.calculatePercentDifference();
        this.remainingCycleDays = this.usagePrediction.Days_InTo_Current_Cycle - this.usageComparison.Days_InTo_Current_Cycle;
      });
    }
  }

  getPercentStyle(number: number): string {
    if (number <= 0) {
      return '#2eb134';
    } else {
      return 'red'; // green
    }
  }

  getKwhStyle(): string {
    const pastUsage = this.usageComparison.Meter_Read_Cycles[0].Usage;
    const estimatedUsage = this.usagePrediction.Meter_Read_Cycles[0].Usage;
    if (pastUsage > estimatedUsage) {
      return '#2eb134';
    } else {
      return 'red';
    }
  }

  getRemainingDaysWidth(): string {
    const daysInCurrentCycle = this.usagePrediction.Days_InTo_Current_Cycle;
    if (daysInCurrentCycle < this.daysInLastCycle) {
      return '28%';
    } else if (daysInCurrentCycle > this.daysInLastCycle) {
      return '32%';
    } else {
      return '30%';
    }
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  private calculatePercentDifference(): void {
    let previousUsageWithinComparisonRange = this.usageComparison.Daily_Usage_List.filter(day => {
      let date = new Date(day.Date);
      if (date >= this.comparisonStartDate && date < this.comparisonEndDate)
        return day;
    });
    let previousUsageInComparisonTotal = previousUsageWithinComparisonRange.map(day => {
      return day.Usage;
    }).reduce((a, b) => a + b, 0);

    const currentUsage = this.usageComparison.Meter_Read_Cycles[1].Usage;
    const increase = currentUsage - previousUsageInComparisonTotal;
    const increaseRatio = increase / previousUsageInComparisonTotal;

    if (isNaN(increaseRatio)) {
      this.percentageIncrease = 0;
    } else {
      this.percentageIncrease = increaseRatio * 100;
    }
  }

  private completeCalculations(): void {
    const date2 = new Date(this.usageComparison.Meter_Read_Cycles[0].End_Date);
    const date1 = new Date(this.usageComparison.Meter_Read_Cycles[0].Start_Date);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.daysInLastCycle = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const daysIntoCycle = this.usageComparison.Days_InTo_Current_Cycle;
    let endDate = new Date(date1);
    endDate.setDate(endDate.getDate() + daysIntoCycle);
    this.comparisonEndDate = endDate;
    this.comparisonStartDate = date1;
  }

}
