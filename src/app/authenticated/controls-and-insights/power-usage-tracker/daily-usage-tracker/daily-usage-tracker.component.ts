import { Component, OnDestroy, ViewChild } from '@angular/core';

import { reverse, toNumber } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { result, startsWith, takeRight, values } from 'lodash';
import { Router } from '@angular/router';
import { UsageComparison } from '../../../../core/models/usage/usage-comparison.model';

import * as moment from 'moment';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'mygexa-daily-usage-tracker',
  templateUrl: './daily-usage-tracker.component.html',
  styleUrls: ['./daily-usage-tracker.component.scss']
})

export class DailyUsageTrackerComponent implements OnDestroy {

  @ViewChild("baseChart") chart: BaseChartDirective;

  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;
  public isDataAvailable = false;

  /* Table and Pagination Data */
  public tablePage = 1;
  public tableData: any[] = [];

  /* Usage Tracker line chart */
  public currentDailyUsage: UsageComparison;
  public dailyUsage: UsageComparison;
  public usageThisCycle: number;
  public cycleDates = [];

  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  
  /* Line Graph Properties */
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5,
        fill: true
      }
    },
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return Math.round(tooltipItem.yLabel * 10) / 10 + ' kWh';
        }
      }
    },
    scales: {
      xAxes: [{
        display: true,
        ticks: {
          callback: function(value, index, values) {
            return `${value.slice(0,value.length-5)}`;
          }
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          callback: function(value, index, values) {
            return `${value} kWh`;
          }
        }
      }]
    }
  };
  public lineChartData = [];
  public lineChartColors: Array<any> = [
    { borderColor: 'rgba(6,81,128,1.0)', backgroundColor: 'rgba(6,81,128,0.5)' },
    { borderColor: 'rgba(254,162,32,1.0)', backgroundColor: 'rgba(254,162,32,0.5)' },
    { borderColor: 'rgba(46,177,52,1.0)', backgroundColor: 'rgba(46,177,52,0.5)' },
    { borderColor: 'rgba(27,141,205,1.0)', backgroundColor: 'rgba(27,141,205,0.5)' }
  ];

  constructor(
    private usageHistoryService: UsageHistoryService,
    private ServiceAccountService: ServiceAccountService,
    public Router: Router

  ) {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        if (activeServiceAccount != this.activeServiceAccount) {
          this.currentDailyUsage = null;
        }
        this.activeServiceAccount = activeServiceAccount;
        this.getUsageHistoryByServiceAccountId();
        this.getUsageComparisonByUAN();
      }
    );
  }



  ngOnDestroy() {
    // Clean up our subscribers to avoid memory leaks.
    this.ServiceAccountsSubscription.unsubscribe();
  }

  getUsageHistoryByServiceAccountId() {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsageHistory(toNumber(this.activeServiceAccount.Id))
        .subscribe(usageHistory => {
          this.tableData = reverse(usageHistory);
          this.isDataAvailable = true;
        });
    }
  }

  getUsageComparisonByUAN() {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsageComparison(this.activeServiceAccount.UAN)
        .subscribe(dailyUsage => {
          if (!this.currentDailyUsage) {
            this.currentDailyUsage = dailyUsage;
            this.getCurrentMonthUsageTotal();
          }
          
          this.dailyUsage = dailyUsage;
          const cycleStart = new Date(dailyUsage.Meter_Read_Cycles[1].Start_Date);
          const cycleEnd = new Date(dailyUsage.Meter_Read_Cycles[1].End_Date)
          this.populateChart(dailyUsage.Daily_Usage_List, cycleStart, cycleEnd);
        });
    }
  }

  getPastUsageHistory(cycleMonth: number, cycleYear: number) {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getPastUsageHistory(this.activeServiceAccount.UAN, cycleMonth, cycleYear)
        .subscribe(dailyUsage => {
          this.dailyUsage = dailyUsage;
          const cycleStart = new Date(dailyUsage.Meter_Read_Cycles[0].Start_Date);
          const cycleEnd = new Date(dailyUsage.Meter_Read_Cycles[0].End_Date);
          this.populateChart(dailyUsage.Daily_Usage_List, cycleStart, cycleEnd);
        });
    }
  }

  populateChart(usageHistory: any[], cycleStartDate: Date, cycleEndDate: Date): void {

    const datagroups = {};

    const currentMonthUsageData = usageHistory.filter(day => {
      const usageDay = new Date(day.Date);
      if (usageDay >= cycleStartDate && usageDay <= cycleEndDate) {
        return day;
      }
    });

    this.getDates(cycleStartDate, cycleEndDate);
    
    let blankDays = 0;
    for (let i = 0; i < this.cycleDates.length; i++) {
      if (!datagroups[1]) {
        datagroups[1] = { data: [], label: "Daily Usage" };
      }

      if (i < currentMonthUsageData.length+blankDays) {
        const currentCycleDate = new Date(this.cycleDates[i]);

        let usageForCycleDate = 0;

        currentMonthUsageData.forEach(ud => {
          if (moment(new Date(ud.Date)).isSame(currentCycleDate, 'day')) {
            usageForCycleDate = ud.Usage;
          }
        });

        if (usageForCycleDate === 0) {
          blankDays++;
        }

        datagroups[1].data.push(usageForCycleDate);
      }
    }

    const dataToDisplay = takeRight(values(datagroups));

    while (this.lineChartData.length) {
      this.lineChartData.pop();
    }

    if (dataToDisplay && dataToDisplay.length > 0) {
      this.lineChartData.push(dataToDisplay);
    }

    if (this.chart !== undefined) {
      this.chart.chart.destroy();
      this.chart.ngOnInit();
    }

    this.isDataAvailable = true;
  }

  showPrevCycleDailyUsage(): void {
    let cycleDate;
    if (this.dailyUsage == this.currentDailyUsage) {
      cycleDate = moment(this.currentDailyUsage.Meter_Read_Cycles[1].Usage_Month);
    } else {
      cycleDate = moment(this.dailyUsage.Meter_Read_Cycles[0].Usage_Month);
    } 
    const prevCycleDate = cycleDate.subtract(1, 'month').toDate();
    this.getPastUsageHistory(prevCycleDate.getMonth()+1, prevCycleDate.getFullYear());
  }

  showCurrentDailyUsage(): void {
    const cycleStart = new Date(this.currentDailyUsage.Meter_Read_Cycles[1].Start_Date);
    const cycleEnd = new Date(this.currentDailyUsage.Meter_Read_Cycles[1].End_Date);
    this.dailyUsage = this.currentDailyUsage;
    this.populateChart(this.currentDailyUsage.Daily_Usage_List, cycleStart, cycleEnd);
  }

  showNextCycleDailyUsage(): void {
    let cycleDate;
    if (this.dailyUsage == this.currentDailyUsage) {
      cycleDate = moment(this.currentDailyUsage.Meter_Read_Cycles[1].Usage_Month);
    } else {
      cycleDate = moment(this.dailyUsage.Meter_Read_Cycles[0].Usage_Month);
    } 
    const prevCycleDate = cycleDate.add(1, 'month').toDate();
    this.getPastUsageHistory(prevCycleDate.getMonth()+1, prevCycleDate.getFullYear());
  }

  private getDates(startDate: Date, endDate: Date): void {
    let dates = [];
    let currentDate = moment(startDate);
    let stopDate = moment(endDate);
    
    while (currentDate <= stopDate) {
      dates.push(currentDate.format("M/DD/YYYY"));
      currentDate = moment(currentDate).add(1, 'days');
    }

    this.cycleDates = dates;
  }

  getCurrentMonthUsageTotal(): void {
    const currentUsageWithinRange = this.currentDailyUsage.Daily_Usage_List.filter(day => {
      let firstDayOfCycle = this.currentDailyUsage.Meter_Read_Cycles[1].Start_Date;
      if (day.Date >= firstDayOfCycle) {
        return day;
      }
    });
    this.usageThisCycle = currentUsageWithinRange.map(day => day.Usage)
    .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    // If no usage then show last month's daily usage
    if (isNaN(this.usageThisCycle) || this.usageThisCycle == 0) {
      const cycleDate = new Date(this.currentDailyUsage.Meter_Read_Cycles[0].Usage_Month);
      const cycleMonth = cycleDate.getMonth() + 1;
      const cycleYear = cycleDate.getFullYear();
      this.getPastUsageHistory(cycleMonth, cycleYear);
    }
  }
}
