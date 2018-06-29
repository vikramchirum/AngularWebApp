import { Component, OnDestroy } from '@angular/core';

import { reverse, toNumber } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { result, startsWith, takeRight, values } from 'lodash';
import { Router } from '@angular/router';
import { UsageComparison } from '../../core/models/usage/usage-comparison.model';

import * as moment from 'moment';

@Component({
  selector: 'mygexa-controls-and-insights',
  templateUrl: './controls-and-insights.component.html',
  styleUrls: ['./controls-and-insights.component.scss']
})
export class ControlsAndInsightsComponent implements OnDestroy {

  public startsWith = startsWith;
  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;
  private isDataAvailable = false;

  /* Table and Pagination Data */
  public tablePage = 1;
  public tableData: any[] = [];

  /* Usage Tracker line chart */
  public dailyUsage: UsageComparison;
  public cycleDates = [];

  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  /* Line Graph Properties */
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0.1,
        fill: true
      }
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return Math.round(tooltipItem.yLabel) + ' kWh';
        }
      }
    },
    scales: {
      xAxes: [{
        display: true
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

  get totalItems(): number {
    return this.tableData.length;
  }

  private getEntries(page: number) {
    const index = (page - 1) * 10;
    const extent = index + 10;
    if (extent > this.tableData.length) {
      return this.tableData.slice(index);
    }
    return this.tableData.slice(index, extent);
  }

  get currentPage() {
    return this.getEntries(this.tablePage);
  }

  public pageChanged(event: any): void {
    this.tablePage = event.page;
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
          this.dailyUsage = dailyUsage;
          this.populateChart(dailyUsage.Daily_Usage_List);
        });
    }
  }

  populateChart(usageHistory: any[]): void {

    const datagroups = {};
    let tempMonth: number;

    const currentMonthUsageData = usageHistory.filter(day => {
      const cycleStart = new Date(this.dailyUsage.Meter_Read_Cycles[1].Start_Date);
      const cycleEnd = new Date(this.dailyUsage.Meter_Read_Cycles[1].End_Date);
      const usageDay = new Date(day.Date);
      if (usageDay >= cycleStart && usageDay <= cycleEnd) {
        this.cycleDates.push(`${usageDay.getMonth() + 1}/${usageDay.getDate()}`);
        return day;
      }
    });
    
    for (let i = 0; i < currentMonthUsageData.length; i++) {
      const usageDate = new Date(currentMonthUsageData[i].Date);
      tempMonth = usageDate.getMonth();

      if (!datagroups[tempMonth]) {
        datagroups[tempMonth] = { data: [], label: this.monthNames[tempMonth] };
      }
      datagroups[tempMonth].data.push(currentMonthUsageData[i].Usage);
    }

    const dataToDisplay = takeRight(values(datagroups));

    while (this.lineChartData.length) {
      this.lineChartData.pop();
    }

    if (dataToDisplay && dataToDisplay.length > 0) {
      this.lineChartData.push(dataToDisplay);
    }

    const cycleStart = new Date(this.dailyUsage.Meter_Read_Cycles[1].Start_Date);
    const cycleEnd = new Date(this.dailyUsage.Meter_Read_Cycles[1].End_Date);
    this.getDates(cycleStart, cycleEnd);

    this.isDataAvailable = true;

  }

  private getDates(startDate: Date, endDate: Date): void {
    let dates = [];
    let currentDate = moment(startDate);
    let stopDate = moment(endDate);
    
    while (currentDate <= stopDate) {
      dates.push(`${currentDate.format("M/DD")}`);
      currentDate = moment(currentDate).add(1, 'days');
    }

    this.cycleDates = dates;
  }

}
