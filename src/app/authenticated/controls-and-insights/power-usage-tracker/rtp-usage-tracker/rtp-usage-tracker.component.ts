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

  usageIntervalLabel: string;
  usageIntervalTotal: number;

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
              } else {
                return value;
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
          kwh: Math.round(10*usageMonth.KwHours)/10,
          avgPrice: (usageMonth.TotalCharge / usageMonth.KwHours) * 100,
          totalCostDollars: Math.trunc(usageMonth.TotalCharge),
          totalCostCents: usageMonth.TotalCharge.toString().split(".")[1].substring(0, 2)
        };
      } else if (this.isDailyView) {
        const dateToFind = new Date(selectedDate);
        const usageDay = this.dailyUsageData.find(d => moment(d.UsageDate).isSame(dateToFind, "day"));
        this.usageInfo = {
          kwh: Math.round(10*usageDay.KwHours)/10,
          avgPrice: (usageDay.TotalCharge / usageDay.KwHours) * 100,
          totalCostDollars: Math.trunc(usageDay.TotalCharge),
          totalCostCents: usageDay.TotalCharge.toString().split(".")[1].substring(0, 2)
        };
      } else if (this.isHourlyView) {
        const hourToFind = selectedDate;
        const usageHour = this.hourlyUsageData.find(h => h.Hour === hourToFind);
        this.usageInfo = {
          kwh: Math.round(10*usageHour.KwHours)/10,
          avgPrice: (usageHour.TotalCharge / usageHour.KwHours) * 100,
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

  showMonthlyUsage() {
    const firstMonth = moment().startOf("year").toDate();
    const lastMonth = moment().endOf("year").toDate();
    this.UsageHistoryService.getMonthlyProfiledBill(this.activeServiceAccount.UAN, firstMonth, lastMonth).subscribe(monthlyUsage => {
    let usage: [MonthlyProfiledBill] = monthlyUsage;
    this.monthlyUsageData = usage;
    this.processMonthlyUsage(usage);
    this.usageIntervalLabel = moment(firstMonth).format("YYYY");
    this.usageIntervalTotal = Math.round(usage.map(u => u.KwHours).reduce((a, b) => a + b, 0)); 
    });
  }

  showDailyUsage() {
    let usageMonth = moment().startOf("month").subtract(1, "month");
    this.UsageHistoryService.getDailyProfiledBill(this.activeServiceAccount.UAN, usageMonth.toDate()).subscribe(dailyUsage => {
      let usage: [DailyProfiledBill] = dailyUsage;
      this.dailyUsageData = usage;
      this.processDailyUsage(usage);
      this.usageIntervalLabel = moment(usageMonth).format("MMMM");
      this.usageIntervalTotal = Math.round(usage.map(u => u.KwHours).reduce((a, b) => a + b, 0));
    });
  }

  showHourlyUsage() {
    let date = moment().startOf("day").subtract(1, "month").toDate();
    this.UsageHistoryService.getHourlyProfiledBill(this.activeServiceAccount.UAN, date).subscribe(hourlyUsage => {
      let usage: [HourlyProfiledBill] = hourlyUsage;
      this.hourlyUsageData = usage;
      this.processHourlyUsage(usage);
      this.usageIntervalLabel = moment(date).format("M/DD");
      this.usageIntervalTotal = Math.round(usage.map(u => u.KwHours).reduce((a, b) => a + b, 0));
    });
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
}
