import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRTPMonthlySavings } from 'app/core/models/savings/rtpmonthlysavings.model';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { MonthlyProfiledBill } from 'app/core/models/profiledbills/profiled-bills.model';
import { RtpsavingsdetailsService } from 'app/core/rtpsavingsdetails.service';
import { environment } from 'environments/environment';

import { Subscription } from 'rxjs';

import * as moment from 'moment';
import * as d3 from 'd3';
@Component({
  selector: 'mygexa-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss']
})
export class SavingsComponent implements OnDestroy {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  @ViewChild('chartWrapper')
  private chartWrapper: ElementRef;

  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountSubscription: Subscription = null;

  private monthlyUsageData: [MonthlyProfiledBill];
  private monthlyUsageSubscription: Subscription = null;

  private currentMonthlyStartMonth: Date = moment().startOf("year").toDate();
  private currentMonthlyEndMonth: Date = moment().endOf("year").toDate();

  public monthlySavings: IRTPMonthlySavings[] = [];
  public totalSavings: number = 0;
  public totalSavingsWhole: number = 0;
  public totalSavingsCents: string = '00';

  public isDataAvailable: boolean = false;
  public isEmptyResponse: boolean = false;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private UsageHistoryService: UsageHistoryService,
    private RtpsavingsdetailsService: RtpsavingsdetailsService
  ) {
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        if (!this.activeServiceAccount.Current_Offer.Is_RTP) {
          // TODO redirect
        } else {
          this.getMonthlyProfiledUsage();
        }
      }
    );
  }

  ngOnDestroy() {
    this.ServiceAccountSubscription.unsubscribe();
    if (this.monthlyUsageSubscription) {
      this.monthlyUsageSubscription.unsubscribe();
    }
  }

  private getMonthlyProfiledUsage() {
    this.monthlyUsageSubscription = this.UsageHistoryService.getMonthlyProfiledBill(this.activeServiceAccount.UAN, this.currentMonthlyStartMonth, this.currentMonthlyEndMonth).subscribe(monthlyUsage => {
      let usage: [MonthlyProfiledBill] = monthlyUsage;
      this.monthlyUsageData = usage;
      if (this.monthlyUsageData.length < 1) this.isEmptyResponse = true;
      this.isDataAvailable = true;
      this.calculateMonthlySavings();
    });
  }

  private calculateMonthlySavings() {
    this.monthlyUsageData.forEach(month => {
      const averageCost = +month.KwHours * (+environment.RTP_EIA_average_rate / 100);
      const savings = averageCost - month.TotalCharge;
      this.totalSavings = this.totalSavings + savings;
      this.monthlySavings.push({
        usageMonth: month.UsageMonth,
        yourPrice: month.TotalCharge,
        averagePrice: averageCost,
        savings: averageCost - month.TotalCharge,
        kWh: month.KwHours
      });
    });
    this.calculateSavingsforUI(this.totalSavings);
    if (this.monthlySavings.length > 0) {
      this.createChart();
    }
  }

  private createChart() {
    // Remove existing SVG
    d3.select('svg').remove();

    // Get chartContainer element in DOM
    const element = this.chartContainer.nativeElement;

    // Set chart data and margins
    const data = this.monthlySavings;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    // Append chart SVG to chartContainer element
    const width = 800;
    const height = 400;
    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set contentWidth and contentHeight
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.left - margin.right;

    // Create x scale and y scale
    const xDomain = data.map(d => d.usageMonth);
    const xRange = [0, contentWidth];
    const yDomain = [0, d3.max(data, d => d.averagePrice)];
    const yRange = [contentHeight, 0];

    const xScale = d3
      .scaleBand()
      .rangeRound(xRange)
      .padding(0.25)
      .domain(xDomain);

    const yScale = d3
      .scaleLinear()
      .rangeRound(yRange)
      .domain(yDomain);

    // Create x axis and y axis
    const yAxis = d3.axisRight(yScale)
      .tickSize(contentWidth)
      .tickFormat((d, i) => `$${d}`);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d, i) => moment(d).format("MMM"));

    const z = d3.scaleOrdinal()
      .range(['rgba(46, 177, 52, .7)', 'rgba(10, 10, 1, .2)'])
      .domain(['yourPrice', 'savings']);

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
    
    // Create groups for each series
    const group = g.selectAll('g.layer')
      .data(d3.stack().keys(['yourPrice', 'savings'])(data), d => d.UsageMonth);
    
    group.exit().remove();
    
    group.enter().append('g')
      .classed('layer', true)
      .attr('fill', d => z(d.key));

    const bars = svg.selectAll('g.layer')
      .selectAll('rect')
      .data(d => d, e => e.data.UsageMonth);

    bars.exit().remove();

    bars.enter().append('rect')
      .attr('class', 'bar')
      .attr('width', xScale.bandwidth())
      .merge(bars)
      .attr('y', d => yScale(d[1]))
      .attr('x', d => xScale(d.data.usageMonth))
      .attr('height', d => {
        if (d[1] > d[0]) {
          return yScale(d[0]) - yScale(d[1]);
        } else {
          return 0;
        }
      })
      .on('click', (d, i, g) => {
        this.RtpsavingsdetailsService.SavingsInfo.next(d.data);
        d3.selectAll('.bar').classed('active', false);
        d3.select(g[i]).classed('active', true);
      })
      .on('mouseover', (d, i, g) => tooltip.style('display', null))
      .on('mouseout', (d, g, i) => tooltip.style('display', 'none'))
      .on('mousemove', (d, i, g) => {
        const xPosition = d3.mouse(this.chartContainer.nativeElement)[0] - 15;
        const yPosition = d3.mouse(this.chartContainer.nativeElement)[1] - 25;
        tooltip.attr('transform', `translate(${xPosition}, ${yPosition})`);
        tooltip.select('text.rtp-tt-heading').text(moment(d.data.usageMonth).format("MMM YYYY").toUpperCase());
        tooltip.select('text.rtp-tt-subheading').text('YOU SAVED');
        tooltip.select('text.rtp-tt-savings').text(`$${Number(Math.round(d.data.savings*100)/100).toFixed(2)}`);
      });
    
    // Prepare tooltips with initial hidden display
    const tooltip = g.append('g')
      .attr('class', 'savings-chart-tooltip')
      .style('display', 'none');
    
    tooltip.append('rect')
      .attr('rx', '15')
      .attr('ry', '15')
      .attr('width', 130)
      .attr('height', 100)
      .attr('fill', 'black')
      .style('opacity', 0.5);
    
    tooltip.append('text')
      .attr('class', 'rtp-tt-heading')
      .attr('x', 16)
      .attr('dy', '1.5em')
      .style('text-anchor', 'start')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .attr('fill', 'white');
    
    tooltip.append('text')
      .attr('class', 'rtp-tt-subheading')
      .attr('x', 16)
      .attr('dy', '3.7em')
      .style('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', 'white');

    tooltip.append('text')
      .attr('class', 'rtp-tt-savings')
      .attr('x', 18)
      .attr('dy', '2.9em')
      .style('text-anchor', 'start')
      .attr('font-size', '28px')
      .attr('font-weight', '600')
      .attr('fill', 'white');

    // Show savings details for last month
    this.RtpsavingsdetailsService.SavingsInfo.next(data[data.length-1]);

    // Utility functions for axis styling and formatting
    function customXAxis(g) {
      g.call(xAxis);
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .style('text-anchor', 'middle');
    }

    function customYAxis(g) {
      g.call(yAxis);
      g.select('.domain').remove();
      g.selectAll('.tick:not(:first-of-type) line')
        .attr('stroke', 'lightgrey')
      g.selectAll('.tick text')
        .attr('font-size', '12px')
        .attr('font-family', 'Open Sans')
        .attr('x', -33);
    }
  }

  private calculateSavingsforUI(savings: Number): void {
    const roundedSavings = Number(savings.toFixed(2));
    this.totalSavingsWhole = Math.trunc(roundedSavings);
    this.totalSavingsCents = Number(roundedSavings % 1).toFixed(2).split('.')[1];
  }
}
