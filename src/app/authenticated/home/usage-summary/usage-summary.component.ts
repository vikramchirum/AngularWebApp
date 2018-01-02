import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { map, takeRight, toNumber } from 'lodash';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-usage-summary',
  templateUrl: './usage-summary.component.html',
  styleUrls: ['./usage-summary.component.scss']
})
export class UsageSummaryComponent implements OnDestroy {

  activeServiceAccount: ServiceAccount = null;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
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
      backgroundColor: 'rgb(27,141,205)',
      borderColor: ' rgb(27,141,205)',
      borderWidth: 1,
    }
  ];
  public barChartData = [];

  private ServiceAccountsSubscription: Subscription = null;

  constructor(
    private usageHistoryService: UsageHistoryService,
    private ServiceAccountService: ServiceAccountService
  ) {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        // Empty out the bar chart arrays:
        while (this.barChartData.length > 0) {
          this.barChartData.pop();
        }
        this.getUsageHistoryByServiceAccountId();
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
        .subscribe(usageHistory => this.populateChart(usageHistory));
    }
  }

  // Fetching labels and data from api response and to show it on chart.
  populateChart(usageHistory) {
    usageHistory.sort((a, b) => a.date - b.date);
    //console.log("usageHistory**************************",usageHistory);
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
