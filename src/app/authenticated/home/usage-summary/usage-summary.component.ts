import { Component } from '@angular/core';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { first, get, map, takeRight, toNumber } from 'lodash';

@Component({
  selector: 'mygexa-usage-summary',
  templateUrl: './usage-summary.component.html',
  styleUrls: ['./usage-summary.component.scss'],
  providers: [UsageHistoryService]
})
export class UsageSummaryComponent {

  activeBillingAccount: BillingAccountClass = null;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          return tooltipItem.yLabel + 'kwh';
        }
      }
    },
    scales: {
        yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0}}]
      }
  };
  public barChartColors: any[] = [
    {
      backgroundColor: '#959595',
      borderColor: '#000000',
      borderWidth: 1,
    }
  ]
  public barChartData = [];

  public stringify = JSON.stringify;

  constructor(
    private usageHistoryService: UsageHistoryService,
    private BillingAccountService: BillingAccountService
  ) {
    this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => {
        this.activeBillingAccount = activeBillingAccount;
        // Empty out the bar chart arrays:
        while (this.barChartData.length > 0) {
          this.barChartData.pop();
        }
        this.getUsageHistoryByBillingAccountId();
      }
    );
  }

  getUsageHistoryByBillingAccountId() {
    if (this.activeBillingAccount) {
      this.usageHistoryService.getUsageHistory(toNumber(this.activeBillingAccount.Id))
        .subscribe(usageHistory => this.populateChart(usageHistory));
    }
  }

  // Fetching labels and data from api response and to show it on chart.
  populateChart(usageHistory) {

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];

    const months: any[] = takeRight(usageHistory, 3);

    // Add the new bar chart:
    this.barChartData.push({
      datasets: [{
        data: map(months, month => month.usage),
        label: 'Energy Consumption'
      }],
      labels: map(months, month => monthNames[month.date.getMonth()]),
    });
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
