import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { takeRight, values } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { UsageComparison, DailyUsage } from '../../../core/models/usage/usage-comparison.model';
import { ValueTransformer } from '@angular/compiler/src/util';

import * as moment from 'moment';

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
  public lastUsageDay: Date;
  public TDU_Name: String;
  public lastReadDate: Date;
  
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
    );

    this.loadFeedbackForm();
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
    const startDate = moment(this.usageComparison.Meter_Read_Cycles[1].Start_Date);
    const endDate = moment(this.usageComparison.Meter_Read_Cycles[1].End_Date);
    startDate.startOf('day');
    endDate.endOf('day');
    this.daysInThisCycle = endDate.diff(startDate, 'days', true);

    const date2 = moment(this.usageComparison.Meter_Read_Cycles[0].End_Date);
    const date1 = moment(this.usageComparison.Meter_Read_Cycles[0].Start_Date);
    date2.endOf('day');
    date1.startOf('day');
    this.daysInLastCycle = date2.diff(date1, 'days', true);

    this.remainingCycleDays = this.daysInThisCycle - this.usageComparison.Days_InTo_Current_Cycle;
    
    const currentUsageWithinRange = this.usageComparison.Daily_Usage_List.filter(day => {
      let firstDayOfCycle = this.usageComparison.Meter_Read_Cycles[1].Start_Date;
      if (day.Date >= firstDayOfCycle) {
        return day;
      }
    });

    this.usageThisCycle = currentUsageWithinRange.map(day => day.Usage)
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    if (this.usageComparison.Daily_Usage_List.length > 0) {
      this.lastReadDate = this.usageComparison.Daily_Usage_List[this.usageComparison.Daily_Usage_List.length-1].Date;
    } else {
      this.lastReadDate = new Date();
    }

    this.calculatePercentDifference();
  }

  private calculatePercentDifference(): void {
    const startDate = new Date(this.usageComparison.Meter_Read_Cycles[0].Start_Date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + this.usageComparison.Days_InTo_Current_Cycle);

    const previousUsageWithinComparisonRange = this.usageComparison.Daily_Usage_List.filter(day => {
      const date = new Date(day.Date);
      if (date >= startDate && date < endDate)
        return day;
    });
    const previousUsageInComparisonTotal = previousUsageWithinComparisonRange.map(day => {
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

  loadFeedbackForm(): void {
    const opinionlabScripts = ['./onlineopinionV5/oo_conf_entry.js'];
    for (let i = 0; i < opinionlabScripts.length; i++) {
      const node = document.createElement('script');
      node.src = opinionlabScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'windows-1252';
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }
}
