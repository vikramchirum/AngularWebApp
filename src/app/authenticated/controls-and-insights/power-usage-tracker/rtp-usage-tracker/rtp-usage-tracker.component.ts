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

  private currentMonthlyStartMonth: Date = moment().startOf("year").toDate();
  private currentMonthlyEndMonth: Date = moment().endOf("year").toDate();
  private currentDailyUsageMonth: Date = moment().subtract(1, "month").startOf("month").toDate();
  private currentHourlyDate: Date;

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
              // Show readable hourly values
              if (value === 0) {
                return "12 AM";
              } else if (value > 12) {
                return `${value - 12} PM`;
              } else {
                return `${value} AM`;
              }
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
        this.isDailyView = true;
        this.showCurrentIntervalUsage();
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
        const usageMonth = this.monthlyUsageData.find(m => new Date(m.UsageMonth).getMonth() === monthIndex);
        this.usageInfo = {
          kwh: Math.round(10*usageMonth.KwHours)/10,
          avgPrice: (usageMonth.TotalCharge / usageMonth.KwHours) * 100,
          totalCostDollars: Math.trunc(usageMonth.TotalCharge),
          totalCostCents: usageMonth.TotalCharge.toString().split(".")[1] ? usageMonth.TotalCharge.toString().split(".")[1].substring(0, 2) : usageMonth.TotalCharge.toString()
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

  getMonthlyUsage() {
    this.UsageHistoryService.getMonthlyProfiledBill(this.activeServiceAccount.UAN, this.currentMonthlyStartMonth, this.currentMonthlyEndMonth).subscribe(monthlyUsage => {
      let usage: [MonthlyProfiledBill] = monthlyUsage;
      this.monthlyUsageData = usage;
      this.processMonthlyUsage(usage);
    });
  }

  getDailyUsage() {
    this.UsageHistoryService.getDailyProfiledBill(this.activeServiceAccount.UAN, this.currentDailyUsageMonth).subscribe(dailyUsage => {
      let usage: [DailyProfiledBill] = dailyUsage;
      this.dailyUsageData = usage;
      this.processDailyUsage(usage);
    });
  }

  getHourlyUsage() {
    if (!this.currentHourlyDate)
      this.currentHourlyDate = new Date(this.dailyUsageData[this.dailyUsageData.length-1].UsageDate);
    this.UsageHistoryService.getHourlyProfiledBill(this.activeServiceAccount.UAN, this.currentHourlyDate).subscribe(hourlyUsage => {
      let usage: [HourlyProfiledBill] = hourlyUsage;
      this.hourlyUsageData = usage;
      this.processHourlyUsage(usage);
    });
  }

  showPrevIntervalUsage() {
    if (this.isMonthlyView) {
      this.currentMonthlyStartMonth = moment(this.currentMonthlyStartMonth).subtract(1, "year").toDate();
      this.currentMonthlyEndMonth = moment(this.currentMonthlyEndMonth).subtract(1, "year").toDate();
      this.getMonthlyUsage();
    } else if (this.isDailyView) {
      this.currentDailyUsageMonth = moment(this.currentDailyUsageMonth).subtract(1, "month").toDate();
      this.getDailyUsage();
    } else if (this.isHourlyView) {
      this.currentHourlyDate = moment(this.currentHourlyDate).subtract(1, "day").toDate();
      this.getHourlyUsage();
    }
  }

  showCurrentIntervalUsage() {
    if (this.isMonthlyView) {
      this.currentMonthlyStartMonth = moment().startOf("year").toDate();
      this.currentMonthlyEndMonth = moment().endOf("year").toDate();
      this.getMonthlyUsage();
    } else if (this.isDailyView) {
      this.currentDailyUsageMonth = moment().subtract(1, "month").startOf("month").toDate();
      this.getDailyUsage();
    } else if (this.isHourlyView) {
      this.currentHourlyDate = new Date(this.dailyUsageData[this.dailyUsageData.length-1].UsageDate);
      this.getHourlyUsage();
    }
  }

  showNextIntervalUsage() {
    if (this.isMonthlyView) {
      this.currentMonthlyStartMonth = moment(this.currentMonthlyStartMonth).add(1, "year").toDate();
      this.currentMonthlyEndMonth = moment(this.currentMonthlyEndMonth).add(1, "year").toDate();
      this.getMonthlyUsage();
    } else if (this.isDailyView) {
      this.currentDailyUsageMonth = moment(this.currentDailyUsageMonth).add(1, "month").toDate();
      this.getDailyUsage();
    } else if (this.isHourlyView) {
      this.currentHourlyDate = moment(this.currentHourlyDate).add(1, "day").toDate();
      this.getHourlyUsage();
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

  private showMonthlyView() {
    this.usageIntervalLabel = moment(this.currentMonthlyStartMonth).format("YYYY");
    this.usageIntervalTotal = Math.round(this.monthlyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0)); 

    this.isMonthlyView = true;
    this.isDailyView = false;
    this.isHourlyView = false;
    this.lastActiveBar = null;
  }

  private showDailyView() {
    this.usageIntervalLabel = moment(this.currentDailyUsageMonth).format("MMMM");
    this.usageIntervalTotal = Math.round(this.dailyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0));

    this.isMonthlyView = false;
    this.isDailyView = true;
    this.isHourlyView = false;
    this.lastActiveBar = null;
  }

  private showHourlyView() {
    this.usageIntervalLabel = moment(this.currentHourlyDate).format("M/DD");
    this.usageIntervalTotal = Math.round(this.hourlyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0));

    this.isMonthlyView = false;
    this.isDailyView = false;
    this.isHourlyView = true;
    this.lastActiveBar = null;
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
    this.showMonthlyView();
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
    this.showDailyView();
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
    this.showHourlyView();
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
