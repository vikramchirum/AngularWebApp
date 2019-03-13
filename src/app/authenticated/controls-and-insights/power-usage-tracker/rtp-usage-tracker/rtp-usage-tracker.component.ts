import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { MonthlyProfiledBill, DailyProfiledBill, HourlyProfiledBill } from '../../../../core/models/profiledbills/profiled-bills.model';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';
import * as d3 from 'd3';
import { UsageComparison, MeterReadCycle } from 'app/core/models/usage/usage-comparison.model';

@Component({
  selector: 'mygexa-rtp-usage-tracker',
  templateUrl: './rtp-usage-tracker.component.html',
  styleUrls: ['./rtp-usage-tracker.component.scss']
})

export class RtpUsageTrackerComponent implements OnDestroy {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  
  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;

  private monthlyUsageData: [MonthlyProfiledBill];
  private dailyUsageData: [DailyProfiledBill];
  private hourlyUsageData: [HourlyProfiledBill];

  private monthlyUsageSubscription: Subscription = null;
  private dailyUsageSubscription: Subscription = null;
  private hourlyUsageSubscription: Subscription = null;
  private currentUsageSubscription: Subscription = null;

  private currentMonthlyStartMonth: Date = moment().startOf("year").toDate();
  private currentMonthlyEndMonth: Date = moment().endOf("year").toDate();
  private currentDailyUsageMonth: Date = moment().subtract(1, "month").startOf("month").toDate();
  private currentHourlyDate: Date;

  isDataAvailable = false;
  isWholesalePricing = true;
  isAllInPricing = false;
  isMonthlyView: boolean;
  isDailyView: boolean;
  isHourlyView: boolean;

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
    this.monthlyUsageSubscription = this.UsageHistoryService.getMonthlyProfiledBill(this.activeServiceAccount.UAN, this.currentMonthlyStartMonth, this.currentMonthlyEndMonth).subscribe(monthlyUsage => {
      let usage: [MonthlyProfiledBill] = monthlyUsage;
      this.monthlyUsageData = usage;
      this.showMonthlyView();
    },
    (error) => {
      this.showCurrentIntervalUsage();
      this.isDataAvailable = true;
    });
  }

  getDailyUsage() {
    this.usageInfo = null;
    this.dailyUsageSubscription = this.UsageHistoryService.getDailyProfiledBill(this.activeServiceAccount.UAN, this.currentDailyUsageMonth).subscribe(dailyUsage => {
      let usage: [DailyProfiledBill] = dailyUsage;
      this.dailyUsageData = usage;
      this.showDailyView();
    },
    (error) => {
      this.getCurrentDailyUsage();
      this.isDataAvailable = true;
    });
  }

  getHourlyUsage() {
    this.usageInfo = null;
    if (!this.currentHourlyDate)
      this.currentHourlyDate = new Date(this.dailyUsageData[this.dailyUsageData.length-1].UsageDate);
    this.hourlyUsageSubscription = this.UsageHistoryService.getHourlyProfiledBill(this.activeServiceAccount.UAN, this.currentHourlyDate).subscribe(hourlyUsage => {
      let usage: [HourlyProfiledBill] = hourlyUsage;
      this.hourlyUsageData = usage;
      this.showHourlyView();
    },
    (error) => {
      this.showCurrentIntervalUsage();
      this.isDataAvailable = true;
    });
  }

  getCurrentDailyUsage() {
    this.usageInfo = null;
    this.currentUsageSubscription = this.UsageHistoryService.getUsageComparison(this.activeServiceAccount.UAN).subscribe(usage => {
      this.showCurrentDailyUsageChart(usage);
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

    this.createMonthlyChart();

    this.isMonthlyView = true;
    this.isDailyView = false;
    this.isHourlyView = false;
  }

  private showDailyView() {
    this.usageIntervalLabel = moment(this.currentDailyUsageMonth).format("MMMM");
    this.usageIntervalTotal = Math.round(this.dailyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0));

    this.createDailyChart();

    this.isMonthlyView = false;
    this.isDailyView = true;
    this.isHourlyView = false;

    this.isDataAvailable = true;
  }

  private showHourlyView() {
    this.usageIntervalLabel = moment(this.currentHourlyDate).format("M/DD");
    this.usageIntervalTotal = Math.round(this.hourlyUsageData.map(u => u.KwHours).reduce((a, b) => a + b, 0));

    this.createHourlyChart();

    this.isMonthlyView = false;
    this.isDailyView = false;
    this.isHourlyView = true;
  }

  private getTotalCostCents(usageCost: Number) {
    let cents = usageCost.toString().split(".")[1].substring(0, 2);
    if (cents.length == 1) {
      return `${cents}0`;
    } else {
      return cents;
    }
  }

  private showUsageOnUI(kwh: number, cost: number, allIn: number) {
    this.usageInfo = {
      kwh: Math.round(10*kwh)/10,
      avgPrice: (cost/kwh) * 100,
      avgPriceAllIn: (allIn/kwh) * 100,
      costDollars: Math.trunc(cost),
      costCents: cost.toString().split(".")[1] ? this.getTotalCostCents(cost) : cost.toString(),
      allInDollars: Math.trunc(allIn),
      allInCents: allIn.toString().split(".")[1] ? this.getTotalCostCents(allIn) : allIn.toString()
    };
  }

  private createMonthlyChart() {
    d3.select('svg').remove();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const element = this.chartContainer.nativeElement;
    const data = this.padMonthlyUsage(this.monthlyUsageData);

    const margin = { top: 20, right: 20, bottom: 20, left: 70 };

    const svg = d3.select(element).append('svg')
      .attr('width', 700)
      .attr('height', 350);
    
    const contentWidth = 700 - margin.left - margin.right;
    const contentHeight = 350 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.25)
      .domain(data.map(d => d.UsageMonth.toString()));
    
    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.KwHours)]);
    
    const xAxis = d3.axisBottom(x)
      .tickFormat((d, i) => monthNames[i]);

    const yAxis = d3.axisRight(y)
      .tickSize(contentWidth);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(customXAxis);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(customYAxis);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.UsageMonth.toString()))
      .attr('y', d => contentHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'rgba(10, 10, 10, 0.1)')
      .attr('stroke', 'rgba(10, 10, 10, 0.3)')
      .on('click', (d, i, g) => {
        this.showUsageOnUI(d.KwHours, d.EnergyCharge, d.TotalCharge);
        d3.selectAll('.bar').classed('active', false);
        d3.select(g[i]).classed('active', true);
      })
      .style('margin-left', "10px")
      .style('margin-left', "10px")
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr('y', d => {
        if (d.KwHours !== 0) {
          return y(d.KwHours)
        } else {
          return contentHeight;
        }
      })
      .attr('height', d => {
        if (d.KwHours !== 0) {
          return contentHeight - y(d.KwHours)
        } else {
          return 0;
        }
      });;

    g.selectAll('.bar:last-child').attr('class', 'bar active');

    let lastUsage;
    data.forEach(d => {
      if (d.KwHours > 0)
        lastUsage = d;
    })
    if (lastUsage)
      this.showUsageOnUI(lastUsage.KwHours, lastUsage.EnergyCharge, lastUsage.TotalCharge);

    function customXAxis(g) {
      g.call(xAxis);
      g.selectAll('.tick text')
        .attr('x', -3)
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans');
    }

    function customYAxis(g) {
      g.call(yAxis);
      g.select('.domain').remove();
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', 'lightgrey')
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('x', -35);
    }
  }

  private createDailyChart() {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.dailyUsageData;

    const margin = { top: 20, right: 20, bottom: 40, left: 30 };

    const svg = d3.select(element).append('svg')
      .attr('width', 800)
      .attr('height', 350);
    
    const contentWidth = 800 - margin.left - margin.right;
    const contentHeight = 350 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.25)
      .domain(data.map(d => d.UsageDate.toString()));
    
    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.KwHours)]);
    
    const xAxis = d3.axisBottom(x)
      .tickFormat((d, i) => new Date(d).toLocaleDateString("en-US", { month: 'numeric', day: 'numeric' }));

    const yAxis = d3.axisRight(y)
      .tickSize(contentWidth);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(customXAxis);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(customYAxis);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.UsageDate.toString()))
      .attr('y', d => contentHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'rgba(10, 10, 10, 0.1)')
      .attr('stroke', 'rgba(10, 10, 10, 0.3)')
      .on('click', (d, i, g) => {
        this.showUsageOnUI(d.KwHours, d.EnergyCharge, d.TotalCharge);
        d3.selectAll('.bar').classed('active', false);
        d3.select(g[i]).classed('active', true);
      })
      .style('margin-left', "10px")
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr('y', d => y(d.KwHours))
      .attr('height', d => contentHeight - y(d.KwHours));

    g.selectAll('.bar:last-child').attr('class', 'bar active');

    const lastUsage = data[data.length-1];
    this.showUsageOnUI(lastUsage.KwHours, lastUsage.EnergyCharge, lastUsage.TotalCharge);

    function customXAxis(g) {
      g.call(xAxis);
      g.selectAll('.tick text')
        .attr('x', -3)
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
    }

    function customYAxis(g) {
      g.call(yAxis);
      g.select('.domain').remove();
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', 'lightgrey')
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('x', -25);
    }
  }

  private createHourlyChart() {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.hourlyUsageData;

    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    const svg = d3.select(element).append('svg')
      .attr('width', 700)
      .attr('height', 350);
    
    const contentWidth = 700 - margin.left - margin.right;
    const contentHeight = 350 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.25)
      .domain(data.map(d => d.Hour.toString()));
    
    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.KwHours)]);
    
    const xAxis = d3.axisBottom(x)
      .tickFormat((d, i) => {
        if (Number(d) == 0) {
          return '12am';
        } else if(Number(d) < 12) {
          return `${d}pm`;
        } else if (Number(d) == 12) {
          return `12pm`;
        } else if (Number(d) > 12) {
          return `${d-12}pm`;
        }
      });

    const yAxis = d3.axisRight(y)
      .tickSize(contentWidth);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(customXAxis);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(customYAxis);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.Hour.toString()))
      .attr('y', contentHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'rgba(10, 10, 10, 0.1)')
      .attr('stroke', 'rgba(10, 10, 10, 0.3)')
      .on('click', (d, i, g) => {
        this.showUsageOnUI(d.KwHours, d.EnergyCharge, d.TotalCharge);
        d3.selectAll('.bar').classed('active', false);
        d3.select(g[i]).classed('active', true);
      })
      .style('margin-left', "10px")
      .transition()
      .duration(600)
      .delay((d, i) => i * 10)
      .attr('y', d => y(d.KwHours))
      .attr('height', d => contentHeight - y(d.KwHours));

    g.selectAll('.bar:last-child').attr('class', 'bar active');

    const lastUsage = data[data.length-1];
    this.showUsageOnUI(lastUsage.KwHours, lastUsage.EnergyCharge, lastUsage.TotalCharge);

    function customXAxis(g) {
      g.call(xAxis);
      g.selectAll('.tick text')
        .attr('x', -3)
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
    }

    function customYAxis(g) {
      g.call(yAxis);
      g.select('.domain').remove();
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', 'lightgrey')
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('x', -25);
    }
  }

  private showCurrentDailyUsageChart(usage: UsageComparison) {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;

    const currentCycle = usage.Meter_Read_Cycles[1].Usage > 0 ? usage.Meter_Read_Cycles[1] : usage.Meter_Read_Cycles[0];
    const data = usage.Daily_Usage_List.filter(u => {
      if (moment(u.Date).isBetween(moment(currentCycle.Start_Date), moment(currentCycle.End_Date), 'days', '[]')) {
        return u;
      }
    });

    this.usageIntervalLabel = moment(currentCycle.End_Date).format("MMMM");
    this.usageIntervalTotal = Math.round(data.map(u => u.Usage).reduce((curr, prev) => curr + prev));

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const svg = d3.select(element).append('svg')
      .attr('width', 700)
      .attr('height', 350);
    
    const contentWidth = 700 - margin.left - margin.right;
    const contentHeight = 350 - margin.top - margin.bottom;
    
    const x = d3
      .scaleTime()
      .rangeRound([0, contentWidth])
      .domain([new Date(currentCycle.Start_Date), new Date(currentCycle.End_Date)]);

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.Usage)]);

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeDay.every(1))
      .tickFormat((d, i) => moment(d).format("M/DD"));

    const yAxis = d3.axisRight(y)
      .tickSize(contentWidth);

    const line = d3.line()
      .x(d => x(new Date(d.Date)))
      .y(d => y(d.Usage))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(customXAxis);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(customYAxis);
    
    g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(new Date(d.Date)))
        .attr('cy', d => y(d.Usage))
        .attr('r', 4);

    const focus = g.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr('radius', 5);
    
    focus.append('line')
      .classed('y', true);
    
    focus.append('rect')
      .attr('x', 9)
      .attr('dy', '.35em');
    
    focus.append('text')
      .attr('x', 18)
      .attr('dy', '20px');

    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', () => {
        const x0 = moment(x.invert(d3.mouse(element)[0])).subtract(1, 'day').toDate().getTime();
        const i = data.indexOf(data.find(d => moment(d.Date).isSame(moment(x0), 'day')));
        const d = data[i];
        
        if (d) {
          focus.attr('transform', `translate(${x(new Date(d.Date))}, ${y(d.Usage)})`);
        
          focus.select('line.y')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', contentHeight - y(d.Usage));

          focus.select('rect')
            .style('rx', '5')
            .style('ry', '5')
            .style('height', '30px')
            .style('width', '125px')
            
          focus.select('text')
              .text(`${moment(d.Date).format('M/DD')} - ${Math.round(d.Usage*10)/10} kWh`)
              .style('font-family', 'Open Sans')
              .style('font-size', '14px')
              .style('fill', 'white');
          }
      });

    d3.select('.overlay')
      .style('fill', 'none')
      .style('pointer-events', 'all');

    d3.selectAll('.focus')
      .style('opacity', 0.7);

    d3.selectAll('.focus circle')
      .style('fill', 'none')
      .style('stroke', 'black');

    d3.selectAll('.focus line')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '1.5px')
      .style('stroke-dasharray', '3.3');

    function customXAxis(g) {
      g.call(xAxis);
      g.selectAll('.tick text')
        .attr('x', -3)
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
    }

    function customYAxis(g) {
      g.call(yAxis);
      g.select('.domain').remove();
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', 'lightgrey')
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('x', -25);
    }
    this.isMonthlyView = false;
    this.isDailyView = true;
    this.isHourlyView = false;
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
}
