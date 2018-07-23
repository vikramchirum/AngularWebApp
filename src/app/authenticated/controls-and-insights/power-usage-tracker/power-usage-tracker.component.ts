import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { takeRight, values } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { UsageComparison, DailyUsage } from '../../../core/models/usage/usage-comparison.model';
import { ValueTransformer } from '@angular/compiler/src/util';

@Component({
  selector: 'mygexa-power-usage-tracker',
  templateUrl: './power-usage-tracker.component.html',
  styleUrls: ['./power-usage-tracker.component.scss']
})
export class PowerUsageTrackerComponent implements OnDestroy {

  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountSubscription: Subscription = null;

  public usageComparison: UsageComparison;
  public usageThisCycle: number;

  public percentageIncrease: number;
  public absolutePercentage: number;
  public daysInLastCycle: number;
  public daysInThisCycle: number;
  public remainingCycleDays: number;
  public isDataAvailable: boolean = false;
  public TDU_Name: String;
  
  constructor(
    private ServiceAccountService: ServiceAccountService,
    private usageHistoryService: UsageHistoryService
  ) { 
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.TDU_Name = activeServiceAccount.TDU_Name;
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
          this.doCalculations();
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
    const estimatedUsage = this.usageComparison.Meter_Read_Cycles[1].Usage;
    if (pastUsage > estimatedUsage) {
      return '#2eb134';
    } else {
      return 'red';
    }
  }

  getRemainingDaysWidth(): string {
    const daysInCurrentCycle = this.usageComparison.Days_InTo_Current_Cycle;
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
  
  private doCalculations() {
    const startDate = new Date(this.usageComparison.Meter_Read_Cycles[1].Start_Date);
    const endDate = new Date(this.usageComparison.Meter_Read_Cycles[1].End_Date);
    const timeDiffThisCycle = Math.abs(startDate.getTime() - endDate.getTime());

    this.daysInThisCycle = Math.ceil(timeDiffThisCycle / (1000 * 3600 * 24));
    this.remainingCycleDays = this.daysInThisCycle - this.usageComparison.Days_InTo_Current_Cycle;

    const date2 = new Date(this.usageComparison.Meter_Read_Cycles[0].End_Date);
    const date1 = new Date(this.usageComparison.Meter_Read_Cycles[0].Start_Date);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.daysInLastCycle = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const currentUsageWithinRange = this.usageComparison.Daily_Usage_List.filter(day => {
      let firstDayOfCycle = this.usageComparison.Meter_Read_Cycles[1].Start_Date;
      if (day.Date >= firstDayOfCycle) {
        return day;
      }
    });

    this.usageThisCycle = currentUsageWithinRange.map(day => day.Usage)
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    this.calculatePercentDifference();
  }

  private calculatePercentDifference(): void {
    const startDate = new Date(this.usageComparison.Meter_Read_Cycles[0].Start_Date);
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + this.usageComparison.Days_InTo_Current_Cycle);

    let previousUsageWithinComparisonRange = this.usageComparison.Daily_Usage_List.filter(day => {
      let date = new Date(day.Date);
      if (date >= startDate && date < endDate)
        return day;
    });
    let previousUsageInComparisonTotal = previousUsageWithinComparisonRange.map(day => {
      return day.Usage;
    }).reduce((a, b) => a + b, 0);
;
    const increase = this.usageThisCycle - previousUsageInComparisonTotal;
    const increaseRatio = increase / previousUsageInComparisonTotal;

    if (isNaN(increaseRatio)) {
      this.percentageIncrease = 0;
    } else {
      this.percentageIncrease = increaseRatio * 100;
    }

    this.absolutePercentage = Math.abs(this.percentageIncrease);
  }

}
