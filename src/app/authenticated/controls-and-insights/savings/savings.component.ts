import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRTPMonthlySavings } from 'app/core/models/savings/rtpmonthlysavings.model';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { MonthlyProfiledBill } from 'app/core/models/profiledbills/profiled-bills.model';
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

  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public monthlySavings: IRTPMonthlySavings[] = [];
  public totalSavings: number = 0;

  private apiAttempts: number = 0;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private UsageHistoryService: UsageHistoryService,
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
      this.calculateMonthlySavings();
      this.apiAttempts = 0;
    },
    (error) => {
      this.apiAttempts++;
      if (this.apiAttempts < 3) this.getMonthlyProfiledUsage();
    });
  }

  private calculateMonthlySavings() {
    this.monthlyUsageData.forEach(month => {
      const averageCost = month.KwHours * (environment.RTP_EIA_average_rate/100);
      if (averageCost > month.EnergyCharge) {
        const savings = averageCost - month.TotalCharge;
        this.totalSavings = this.totalSavings + savings;
        this.monthlySavings.push({
          usageMonth: month.UsageMonth,
          yourPrice: month.TotalCharge,
          savings: averageCost - month.TotalCharge
        });
      }
    });
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
    console.log(data);
    const margin = { top: 20, right: 20, bottom: 40, left: 70 };

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
    const yDomain = [0, d3.max(data, d => d.yourPrice + d.savings)];
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
      .tickSize(contentWidth);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d, i) => this.monthNames[moment(d.usageMonth).month()]);

    // Set colors
    const colors = ['#000', '#333'];

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
    const groups = g.selectAll('g.cost')
      .data(data)
      .enter().append('g')
      .attr('class', 'cost');

    // Create and append bars with animation
    const rect = groups.selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xScale(d.usageMonth))
      .attr('y', d => yScale(d.yourPrice + d.savings))
      .attr('height', d => yScale(d.savings))
      .attr('width', xScale.bandwidth())
      // .on('mouseover', () => tooltip.style('display', null))
      // .on('mouseout', () => tooltip.style('display', 'none'))
      // .on('mousemove', d => {
      //   const xPosition = d3.mouse(this)[0] - 15;
      //   const yPosition = d3.mouse(this)[1] - 25;
      //   tooltip.attr('transform', `translate(${xPosition}, ${yPosition})`);
      //   tooltip.select('text').text(d.yourPrice);
      // });
    
    // Prepare tooltips with initial hidden display
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');
    
    tooltip.append('rect')
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', 'white')
      .style('opacity', 0.5);
    
    tooltip.append('text')
      .attr('x', 15)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

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
}
