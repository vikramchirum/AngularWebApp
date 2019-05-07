import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UsageComparison, DailyUsage, MeterReadCycle } from 'app/core/models/usage/usage-comparison.model';
import { MonthlyProfiledBill, DailyProfiledBill, HourlyProfiledBill } from '../../../../core/models/profiledbills/profiled-bills.model';
import { UsageComparison, DailyUsage, MeterReadCycle } from 'app/core/models/usage/usage-comparison.model';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'mygexa-rtp-usage-tracker',
  templateUrl: './rtp-usage-tracker.component.html',
  styleUrls: ['./rtp-usage-tracker.component.scss']
})

export class RtpUsageTrackerComponent implements OnDestroy {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  @ViewChild('chartWrapper')
  private chartWrapper: ElementRef;
  
  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;

  private monthlyUsageData: [MonthlyProfiledBill];
  private dailyUsageData: [DailyProfiledBill];
  private hourlyUsageData: [HourlyProfiledBill];
  private nonBilledUsageData: DailyUsage[];

  private monthlyUsageSubscription: Subscription = null;
  private dailyUsageSubscription: Subscription = null;
  private hourlyUsageSubscription: Subscription = null;
  private currentUsageSubscription: Subscription = null;

  private currentMonthlyStartMonth: Date = moment().startOf("year").toDate();
  private currentMonthlyEndMonth: Date = moment().endOf("year").toDate();
  private currentDailyUsageMonth: Date = moment().subtract(1, "month").startOf("month").toDate();
  private currentHourlyDate: Date;
  private currentCycle: MeterReadCycle;
  private currentNonBilledUsage: UsageComparison;

  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  isDataAvailable = false;
  isWholesalePricing = true;
  isAllInPricing = false;
  isMonthlyView: boolean;
  isDailyView: boolean;
  isHourlyView: boolean;
  isNonBilledView: boolean;
  showNoHourlyUsageMessage: boolean;

  usageIntervalLabel: string;
  usageIntervalTotal: number;

  usageInfo: { 
    kwh: number, 
    avgPrice: number,
    avgPriceAllIn: number,
    costDollars: number,
    costCents: string,
    allInDollars: number,
    allInCents: string
  };

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
    if (this.monthlyUsageSubscription) {
      this.monthlyUsageSubscription.unsubscribe();
    }
    if (this.dailyUsageSubscription) {
      this.dailyUsageSubscription.unsubscribe();
    }
    if (this.hourlyUsageSubscription) {
      this.hourlyUsageSubscription.unsubscribe();
    }
    if (this.currentUsageSubscription) {
      this.currentUsageSubscription.unsubscribe();
    }
  }

  getMonthlyUsage() {
    this.usageInfo = null;
    this.isMonthlyView = true;
    this.isDailyView = false;
    this.isHourlyView = false;
    this.isNonBilledView = false;
    this.isDataAvailable = false;
    this.chartWrapper.nativeElement.hidden = true;
    this.showNoHourlyUsageMessage = false;
    this.usageIntervalLabel = moment(this.currentMonthlyStartMonth).format("YYYY");
    this.usageIntervalTotal = 0;
    this.monthlyUsageSubscription = this.UsageHistoryService.getMonthlyProfiledBill(this.activeServiceAccount.UAN, this.currentMonthlyStartMonth, this.currentMonthlyEndMonth).subscribe(monthlyUsage => {
      let usage: [MonthlyProfiledBill] = monthlyUsage;
      this.monthlyUsageData = usage;
      this.usageIntervalTotal = Math.round(this.monthlyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0)); 
      this.chartWrapper.nativeElement.hidden = false;
      this.isDataAvailable = true;
      this.createChart();
    },
    (error) => {
      this.showCurrentIntervalUsage();
    });
  }

  getDailyUsage() {
    this.usageInfo = null;
    this.isMonthlyView = false;
    this.isDailyView = true;
    this.isHourlyView = false;
    this.isNonBilledView = false;
    this.isDataAvailable = false;
    if (this.chartWrapper) 
      this.chartWrapper.nativeElement.hidden = true;
    this.showNoHourlyUsageMessage = false;
    this.usageIntervalLabel = moment(this.currentDailyUsageMonth).format("MMMM");
    this.usageIntervalTotal = 0;
    this.dailyUsageSubscription = this.UsageHistoryService.getDailyProfiledBill(this.activeServiceAccount.UAN, this.currentDailyUsageMonth).subscribe(dailyUsage => {
      let usage: [DailyProfiledBill] = dailyUsage;
      this.dailyUsageData = usage;
      this.usageIntervalTotal = Math.round(this.dailyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0));
      this.isDataAvailable = true;
      this.chartWrapper.nativeElement.hidden = false;
      this.createChart();
    },
    (error) => {
      this.getCurrentDailyUsage();
    });
  }

  getHourlyUsage() {
    this.usageInfo = null;
    this.isMonthlyView = false;
    this.isDailyView = false;
    this.isHourlyView = true;
    this.isNonBilledView = false;
    this.isDataAvailable = false;
    this.chartWrapper.nativeElement.hidden = true;
    this.showNoHourlyUsageMessage = false;
    this.usageIntervalTotal = 0;
    if (!this.currentHourlyDate) {
      this.currentHourlyDate = new Date(this.dailyUsageData[this.dailyUsageData.length-1].UsageDate);
    }
    this.usageIntervalLabel = moment(this.currentHourlyDate).format("M/DD");
    this.hourlyUsageSubscription = this.UsageHistoryService.getHourlyProfiledBill(this.activeServiceAccount.UAN, this.currentHourlyDate).subscribe(hourlyUsage => {
      let usage: [HourlyProfiledBill] = hourlyUsage;
      this.hourlyUsageData = usage;
      this.usageIntervalTotal = Math.round(this.hourlyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0));
      this.isDataAvailable = true;
      this.chartWrapper.nativeElement.hidden = false;
      this.createChart();
    },
    (error) => {
      this.isDataAvailable = true;
      this.showNoHourlyUsageMessage = true;
    });
  }

  getCurrentDailyUsage() {
    this.usageInfo = null;
    this.isMonthlyView = false;
    this.isDailyView = false;
    this.isHourlyView = false;
    this.isNonBilledView = true;
    this.isDataAvailable = false;
    this.chartWrapper.nativeElement.hidden = true;
    this.showNoHourlyUsageMessage = false;
    this.usageIntervalTotal = 0;
    if (!this.currentNonBilledUsage) {
      this.currentUsageSubscription = this.UsageHistoryService.getUsageComparison(this.activeServiceAccount.UAN).subscribe(usage => {
        this.currentNonBilledUsage = usage;
        this.currentCycle = usage.Meter_Read_Cycles[1].Usage > 0 ? usage.Meter_Read_Cycles[1] : usage.Meter_Read_Cycles[0];
        const currentCycleUsage = usage.Daily_Usage_List.filter(u => {
          if (moment(u.Date).isBetween(moment(this.currentCycle.Start_Date), moment(this.currentCycle.End_Date), 'days', '[]')) {
            return u;
          }
        });
        this.usageIntervalLabel = moment(this.currentCycle.End_Date).format("MMMM");
        this.usageIntervalTotal = Math.round(currentCycleUsage.map(u => u.Usage).reduce((curr, prev) => curr + prev));
        this.nonBilledUsageData = currentCycleUsage;
        this.isDataAvailable = true;
        this.chartWrapper.nativeElement.hidden = false;
        this.createChart();
      });
    } else {
      this.usageIntervalLabel = moment(this.currentCycle.End_Date).format("MMMM");
      this.usageIntervalTotal = Math.round(this.nonBilledUsageData.map(u => u.Usage).reduce((curr, prev) => curr + prev));
      this.isDataAvailable = true;
      this.chartWrapper.nativeElement.hidden = false;
      this.createChart();
    }
  }

  showPrevIntervalUsage() {
    if (this.isMonthlyView) {
      this.currentMonthlyStartMonth = moment(this.currentMonthlyStartMonth).subtract(1, "year").toDate();
      this.currentMonthlyEndMonth = moment(this.currentMonthlyEndMonth).subtract(1, "year").toDate();
      this.getMonthlyUsage();
    } else if (this.isDailyView || this.isNonBilledView) {
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
    } else if (this.isDailyView || this.isNonBilledView) {
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
    } else if (this.isDailyView || this.isNonBilledView) {
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

  private getTotalCostCents(usageCost: number) {
    let cents = usageCost % 1;
    return cents.toFixed(2).split(".")[1];
  }

  private showUsageOnUI(kwh: number, cost: number, allIn: number) {
    this.usageInfo = {
      kwh: Math.round(10*kwh)/10,
      avgPrice: (cost/kwh) * 100,
      avgPriceAllIn: (allIn/kwh) * 100,
      costDollars: Math.trunc(cost),
      costCents: this.getTotalCostCents(cost),
      allInDollars: Math.trunc(allIn),
      allInCents: this.getTotalCostCents(allIn)
    };
  }

  private createChart() {
    // Remove existing SVG
    d3.select('svg').remove();

    // Get chartContainer element in DOM
    const element = this.chartContainer.nativeElement;

    // Set chart data and margins
    let data; let margin = { top: 0, right: 0, bottom: 0, left: 0 };
    if (this.isMonthlyView) {
      data = this.padMonthlyUsage(this.monthlyUsageData);
      margin = { top: 20, right: 20, bottom: 40, left: 70 };
    } else if (this.isDailyView) {
      data = this.dailyUsageData;
      margin = { top: 20, right: 20, bottom: 40, left: 40 };
    } else if (this.isHourlyView) {
      data = this.hourlyUsageData;
      margin = { top: 20, right: 20, bottom: 50, left: 40 };
    } else if (this.isNonBilledView) {
      data = this.processCurrentUsage(this.nonBilledUsageData);
      margin = { top: 20, right: 20, bottom: 40, left: 40 };
    }

    // Append chart SVG to chartContainer element
    const height = 350;
    const width = this.isDailyView || this.isNonBilledView ? 800 : 700;
    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set contentWidth and contentHeight
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // Create x scale and y scale
    let xDomain = []; 
    const xRange = [0, contentWidth];
    let yDomain = [0, d3.max(data, d => d.KwHours)]; 
    const yRange = [contentHeight, 0];

    if (this.isMonthlyView) {
      xDomain = data.map(d => d.UsageMonth.toString());
    } else if (this.isDailyView) {
      xDomain = data.map(d => d.UsageDate.toString());
    } else if (this.isHourlyView) {
      xDomain = data.map(d => d.Hour.toString());
    } else if (this.isNonBilledView) {
      yDomain = [0, d3.max(data, d => d.Usage)];
      xDomain = data.map(d => d.Date.toString());
    }
    
    const xScale = d3
      .scaleBand()
      .rangeRound(xRange)
      .padding(0.25)
      .domain(xDomain);
    
    const yScale = d3
      .scaleLinear()
      .rangeRound(yRange)
      .domain(yDomain);
    
    // Create x axis (based on view) and y axis
    const yAxis = d3.axisRight(yScale)
      .tickSize(contentWidth);

    let xAxis;
    if (this.isMonthlyView) {
      xAxis = d3.axisBottom(xScale).tickFormat((d, i) => this.monthNames[i]);
    } else if (this.isDailyView) {
      xAxis = d3.axisBottom(xScale).tickFormat((d, i) => moment(d).format("M/DD"));
    } else if (this.isHourlyView) {
      xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
        if (Number(d) == 0) {
          return '12am';
        } else if(Number(d) < 12) {
          return `${d}am`;
        } else if (Number(d) == 12) {
          return `12pm`;
        } else if (Number(d) > 12) {
          return `${d-12}pm`;
        }
      });
    } else if (this.isNonBilledView) {
      xAxis = d3.axisBottom(xScale).ticks(d3.timeDay.every(1)).tickFormat((d, i) => moment(d).format("M/DD"));
    }

    // Append new group to SVG
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Append x axis and y axis
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(customXAxis);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(customYAxis);

    // Create and append bars with animation
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => {
        if (this.isMonthlyView) {
          return xScale(d.UsageMonth.toString());
        } else if (this.isDailyView) {
          return xScale(d.UsageDate.toString());
        } else if (this.isHourlyView) {
          return xScale(d.Hour.toString());
        } else if (this.isNonBilledView) {
          return xScale(d.Date.toString());
        }
      })
      .attr('y', contentHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', 'rgba(10, 10, 10, 0.1)')
      .attr('stroke', 'rgba(10, 10, 10, 0.3)')
      .on('click', (d, i, g) => {
        if (!this.isNonBilledView) {
          this.showUsageOnUI(d.KwHours, d.EnergyCharge, d.TotalCharge);
          if (this.isDailyView) {
            this.currentHourlyDate = moment(d.UsageDate).toDate();
          }
        } else {
          this.currentHourlyDate = moment(d.Date).toDate();
          this.showUsageOnUI(d.Usage, 0, 0);
        }
        d3.selectAll('.bar').classed('active', false);
        d3.select(g[i]).classed('active', true);
      })
      .style('margin-left', "10px")
      .style('margin-left', "10px")
      // Animate bars
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr('y', d => {
        if (this.isNonBilledView) {
          return yScale(d.Usage);
        } else if (d.KwHours !== 0) {
          return yScale(d.KwHours);
        } else {
          return contentHeight;
        }
      })
      .attr('height', d => {
        if (this.isNonBilledView) {
          return contentHeight - yScale(d.Usage);
        } else if (d.KwHours !== 0) {
          return contentHeight - yScale(d.KwHours);
        } else {
          return 0;
        }
      });

    // Set last bar as active and show usage
    g.selectAll('.bar:last-child').attr('class', 'bar active');

    data.forEach(d => {
      if (this.isNonBilledView && d.Usage > 0) {
        this.showUsageOnUI(d.Usage, 0, 0);
      } else if (d.KwHours > 0) {
        this.showUsageOnUI(d.KwHours, d.EnergyCharge, d.TotalCharge);
      }
    });

    // Scroll chart if necessary
    if (this.isMonthlyView) {
      if (this.monthlyUsageData.length > 4 && this.monthlyUsageData.length < 9) {
        this.chartWrapper.nativeElement.scrollTo({ left: contentWidth/3, behavior: 'smooth' });
      } else if (this.monthlyUsageData.length > 8) {
        this.chartWrapper.nativeElement.scrollTo({ left: contentWidth, behavior: 'smooth' });
      } else {
        this.chartWrapper.nativeElement.scrollTo({ right: 0, behavior: 'smooth' });
      }
    } else if (this.isDailyView) {
      if (this.dailyUsageData.length > 11 && this.dailyUsageData.length < 22) {
        this.chartWrapper.nativeElement.scrollTo({ left: contentWidth/3, behavior: 'smooth' });
      } else if (this.dailyUsageData.length > 21) {
        this.chartWrapper.nativeElement.scrollTo({ left: contentWidth, behavior: 'smooth' });
      } else {
        this.chartWrapper.nativeElement.scrollTo({ right: 0, behavior: 'smooth' });
      }
    } else if (this.isNonBilledView) {
      if (this.nonBilledUsageData.length > 11 && this.nonBilledUsageData.length < 22) {
        this.chartWrapper.nativeElement.scrollTo({ left: contentWidth/3, behavior: 'smooth' });
      } else if (this.nonBilledUsageData.length > 21) {
        this.chartWrapper.nativeElement.scrollTo({ left: contentWidth, behavior: 'smooth' });
      } else {
        this.chartWrapper.nativeElement.scrollTo({ right: 0, behavior: 'smooth' });
      }
    } else if (this.isHourlyView) {
      this.chartWrapper.nativeElement.scrollTo({ left: contentWidth, behavior: 'smooth' });
    }

    // Utility functions for axis styling and formatting
    function customXAxis(g) {
      g.call(xAxis);
      g.selectAll('.tick text')
        .attr('x', -3)
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    }

    function customYAxis(g) {
      g.call(yAxis);
      g.select('.domain').remove();
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', 'lightgrey')
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('x', -30);
    }
  }

  private padMonthlyUsage(usage: MonthlyProfiledBill[]): MonthlyProfiledBill[] {
    let paddedUsage = [];
    for (let i = 0; i < 12; i++) {
      let monthlyUsage: MonthlyProfiledBill = {
        UsageMonth: moment(this.currentMonthlyStartMonth).add(i, 'months').toDate(),
        StartDate: new Date(),
        EndDate: new Date(),
        KwHours: 0,
        TotalCharge: 0,
        EnergyCharge: 0
      };
      let u = usage.find(um => moment(um.UsageMonth).isSame(monthlyUsage.UsageMonth, "month"));
      if (u) {
        paddedUsage.push(u);
      } else {
        paddedUsage.push(monthlyUsage);
      }
    }
    return paddedUsage;
  }

  private processCurrentUsage(usage: DailyUsage[]): DailyUsage[] {
    let processedUsage = [];
    const cycleDays = moment(this.currentCycle.End_Date).add(1, 'day')
      .diff(this.currentCycle.Start_Date, "days", true);
    for (let i = 0; i < cycleDays; i++) {
      const cycleDate = moment(this.currentCycle.Start_Date).add(i, 'days');
      let cycleDateUsage = usage.find(u => cycleDate.isSame(moment(u.Date), 'day'));
      if (cycleDateUsage) {
        processedUsage.push(cycleDateUsage);
      } else {
        let zeroUsage: DailyUsage = {
          Date: cycleDate.toDate(),
          Usage: 0,
          Source: "" 
        };
        processedUsage.push(zeroUsage);
      }
    }
    return processedUsage;
  }
}
