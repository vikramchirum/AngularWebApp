import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MonthlyProfiledBill, DailyProfiledBill, HourlyProfiledBill } from '../../../../core/models/profiledbills/profiled-bills.model';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Observable } from 'rxjs';
import { takeRight, values, reverse } from 'lodash';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'mygexa-rtp-usage-tracker',
  templateUrl: './rtp-usage-tracker.component.html',
  styleUrls: ['./rtp-usage-tracker.component.scss']
})

export class RtpUsageTrackerComponent implements OnDestroy {
  
  @ViewChild("baseChart") chart: BaseChartDirective;
  
  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;

  private monthlyUsageData: [MonthlyProfiledBill];
  private dailyUsageData: [DailyProfiledBill];
  private hourlyUsageData: [HourlyProfiledBill];

  private chartLabels = [];

  isDataAvailable: Boolean;
  isMonthlyView: boolean;
  isDailyView: boolean;
  isHourlyView: boolean;
  isWholesalePricing = true;
  isAllInPricing = false;

  lastActiveBar: any;

  usageInfo: { 
    kwh: number, 
    avgPrice: number, 
    totalCostDollars: number,
    totalCostCents: string
  };

  /* Bar Graph Properties */
  public barChartColors = [
    {
      backgroundColor: "rgba(10, 10, 10, 0.1)",
      borderColor: "rgba(10, 10, 10, 0.3)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(46, 177, 52,0.9)",
      hoverBorderColor: "rgba(46, 177, 52,1)",
    }
  ];
  public barChartOptions: any = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          callback: function(value, index, values) {
            if (typeof value === "string") {
              if (value.length > 3) {
                // Is monthly view. 
                // Show correct date label format (MM/DD)
                return value.substring(0, value.length-5);
              }
            } else {
              return value;
            }
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value, index, values) {
            if (Number(value) > 0 && Number(value) < 1) {
              return `${value.toString().substring(0, 4)} kWh`;
            } else {
              return `${value} kWh`;
            }
          }
        }
      }]
    },
    min: 0
  };
  public barChartData = [];

  constructor(
    private UsageHistoryService: UsageHistoryService,
    private ServiceAccountService: ServiceAccountService
  ) {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.showDailyUsage();
      }
    );
   }

  ngOnDestroy() {
    this.ServiceAccountsSubscription.unsubscribe();
  }

  chartClicked(event) {
    const elements = event.active;
    if (elements.length) {
      if (this.lastActiveBar) {
        // Reset background of the last bar that was clicked
        this.lastActiveBar.custom.backgroundColor = "rgba(10, 10, 10, 0.1)";
        this.lastActiveBar._chart.update();
      }
      // Set the background of the new bar that was clicked
      elements[0].custom = elements[0].custom || {};
      elements[0].custom.backgroundColor = "#2eb134";

      // Store new active bar to reset background later
      this.lastActiveBar = elements[0];

      // Display usage info for the new bar that was clicked
      const selectedDate = elements[0]._model.label;
      if (this.isMonthlyView) {
        const monthIndex = this.chartLabels.indexOf(selectedDate);
        const usageMonth = this.monthlyUsageData.find(m => m.UsageMonth.getMonth() === monthIndex);
        this.usageInfo = {
          kwh: usageMonth.KwHours,
          avgPrice: (usageMonth.TotalCharge / usageMonth.KwHours),
          totalCostDollars: Math.trunc(usageMonth.TotalCharge),
          totalCostCents: usageMonth.TotalCharge.toString().split(".")[1].substring(0, 2)
        };
      } else if (this.isDailyView) {
        const dateToFind = new Date(selectedDate);
        const usageDay = this.dailyUsageData.find(d => moment(d.UsageDate).isSame(dateToFind, "day"));
        this.usageInfo = {
          kwh: usageDay.KwHours,
          avgPrice: (usageDay.TotalCharge / usageDay.KwHours),
          totalCostDollars: Math.trunc(usageDay.TotalCharge),
          totalCostCents: usageDay.TotalCharge.toString().split(".")[1].substring(0, 2)
        };
      } else if (this.isHourlyView) {
        const hourToFind = selectedDate;
        const usageHour = this.hourlyUsageData.find(h => h.Hour === hourToFind);
        this.usageInfo = {
          kwh: usageHour.KwHours,
          avgPrice: (usageHour.TotalCharge / usageHour.KwHours),
          totalCostDollars: 1,
          totalCostCents: usageHour.TotalCharge.toString().split(".")[1].substring(0, 2)
        };
      }
    }
  }

  showWholesalePricing() {
    this.isWholesalePricing = true;
    this.isAllInPricing = false;
  }

  showAllInPricing() {
    this.isWholesalePricing = false;
    this.isAllInPricing = true;
  }

  private showMonthlyUsage() {
    const firstMonth = moment().startOf("year").toDate();
    const lastMonth = moment().endOf("year").toDate();
    // this.UsageHistoryService.getMonthlyProfiledBill(this.activeServiceAccount.UAN, firstMonth, lastMonth).subscribe(monthlyUsage => {
    //  let usage: [MonthlyProfiledBill] = this.getTempMonthlyUsage();
    //  this.processMonthlyUsage(usage);
    // });
    let usage: [MonthlyProfiledBill] = this.getTempMonthlyUsage();
    this.processMonthlyUsage(usage);
    this.monthlyUsageData = usage;
  }

  private showDailyUsage() {
    let usageMonth = moment().startOf("month");
    // this.UsageHistoryService.getDailyProfiledBill(this.activeServiceAccount.UAN, usageMonth.toDate()).subscribe(dailyUsage => {
    //   let usage: [DailyProfiledBill] = dailyUsage;
    //   this.processDailyUsage(usage);
    // });
    let usage: [DailyProfiledBill] = this.getTempDailyUsage();
    this.processDailyUsage(usage);
    this.dailyUsageData = usage;
  }

  private showHourlyUsage() {
    let date = moment().startOf("day").toDate();
    // this.UsageHistoryService.getHourlyProfiledBill(this.activeServiceAccount.UAN, date).subscribe(hourlyUsage => {
    //   let usage: [HourlyProfiledBill] = hourlyUsage;
    //   this.processHourlyUsage(usage);
    // });
    let usage: [HourlyProfiledBill] = this.getTempHourlyUsage();
    this.processHourlyUsage(usage);
    this.hourlyUsageData = usage;
  }

  private processMonthlyUsage(usage: [MonthlyProfiledBill]) {
    const datagroups = {};
    if (!datagroups[0]) {
      datagroups[0] = {
        data: []
      };
    }

    // Cycle through months to match usage
    for (let m = 0; m < 12; m++) {
      let monthsUsage = 0;
      usage.forEach(um => {
        if (new Date(um.UsageMonth).getMonth() === m) {
          monthsUsage = um.KwHours;
        }
      });
      datagroups[0].data.push(monthsUsage);
    }

    this.chartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    this.populateChart(takeRight(values(datagroups)));

    this.isMonthlyView = true;
    this.isDailyView = false;
    this.isHourlyView = false;
    this.lastActiveBar = null;
  }

  private processDailyUsage(usage: [DailyProfiledBill]) {
    const datagroups = {};
    if (!datagroups[0]) {
      datagroups[0] = {
        data: []
      };
    }

    usage.forEach(ud => {
      datagroups[0].data.push(ud.KwHours);
    });

    this.populateChart(takeRight(values(datagroups)));

    this.chartLabels = usage.map(ud => new Date(ud.UsageDate).toLocaleDateString('us-EN', { month: 'numeric', day: 'numeric', year: 'numeric' }));

    this.isMonthlyView = false;
    this.isDailyView = true;
    this.isHourlyView = false;
    this.lastActiveBar = null;
  }

  private processHourlyUsage(usage: [HourlyProfiledBill]) {
    let datagroups = {};

    if (!datagroups[0]) {
      datagroups[0] = {
        data: []
      };
    }

    usage.forEach(uh => {
      datagroups[0].data.push(uh.KwHours);
    });

    this.populateChart(takeRight(values(datagroups)))

    this.chartLabels = usage.map(uh => uh.Hour);

    this.isMonthlyView = false;
    this.isDailyView = false;
    this.isHourlyView = true;
    this.lastActiveBar = null;
  }

  private populateChart(dataToDisplay: any) {
    while (this.barChartData.length) {
      this.barChartData.pop();
    }

    if (dataToDisplay && dataToDisplay.length > 0) {
      this.barChartData.push(dataToDisplay);
    }

    if (this.chart !== undefined) {
      this.chart.chart.destroy();
      this.chart.ngOnInit();
    }

    this.isDataAvailable = true;

    this.usageInfo = null;
  }

  getTempMonthlyUsage(): [MonthlyProfiledBill] {
    let monthlyUsage = [];
    monthlyUsage.push({
      UsageMonth: moment("2015-02-01", "YYYY-MM-DD").toDate(),
      StartDate: moment("2015-02-09", "YYYY-MM-DD").toDate(),
      EndDate: moment("2015-03-08", "YYYY-MM-DD").toDate(),
      KwHours: 373,
      TotalCharge: 19.38,
      EnergyCharge: 16.14
    });
    monthlyUsage.push({
      UsageMonth: moment("2015-03-01", "YYYY-MM-DD").toDate(),
      StartDate: moment("2015-03-09", "YYYY-MM-DD").toDate(),
      EndDate: moment("2015-04-09", "YYYY-MM-DD").toDate(),
      KwHours: 346,
      TotalCharge: 20.48,
      EnergyCharge: 15.39
    });
    monthlyUsage.push({
      UsageMonth: moment("2015-04-01", "YYYY-MM-DD").toDate(),
      StartDate: moment("2015-04-10", "YYYY-MM-DD").toDate(),
      EndDate: moment("2015-05-10", "YYYY-MM-DD").toDate(),
      KwHours: 364,
      TotalCharge: 19.96,
      EnergyCharge: 15.75
    });
    return monthlyUsage as [MonthlyProfiledBill];
  }

  getTempDailyUsage(): [DailyProfiledBill] {
    let dailyUsage = [];
    dailyUsage.push({
      UsageDate: moment("2015-02-09", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-10", "YYYY-MM-DD").toDate(),
      KwHours: 14.131564132156213,
      TotalCharge: 0.8316131321645135,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-11", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-12", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-13", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-14", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-15", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-16", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-17", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-18", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    dailyUsage.push({
      UsageDate: moment("2015-02-19", "YYYY-MM-DD").toDate(),
      KwHours: 11.883614109228128,
      TotalCharge: 0.70340000490086476,
      EnergyCharge: 0.5285804079220257
    });
    return dailyUsage as [DailyProfiledBill];
  }

  getTempHourlyUsage(): [HourlyProfiledBill] {
    let hourlyUsage = [];
    hourlyUsage.push({
      Hour: 0,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 1,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 2,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 3,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 4,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 5,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 6,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 7,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 8,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 9,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 10,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 11,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 12,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 13,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 14,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    hourlyUsage.push({
      Hour: 15,
      KwHours: 0.4945396139745626,
      TotalCharge: 0.02875706869571697,
      EnergyCharge: 0.02176247526473973
    });
    return hourlyUsage as [HourlyProfiledBill];
  }
}
