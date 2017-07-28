import { Component, OnDestroy } from '@angular/core';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { takeRight, toNumber, reverse, values } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import {ServiceAccount} from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-usage-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.scss']
})
export class UsageHistoryComponent implements OnDestroy {

  activeServiceAccount: ServiceAccount = null;

  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

  /* Bar Graph Properties */
  public barChartOptions: any = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return tooltipItem.yLabel + 'kwh';
        }
      }
    },
    scales: {
      xAxes: [{
        display: true
      }],
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        }
      }]
    },
    min: 0
  };
  public barChartData = [];
  public barChartColors: any[] = [
    { backgroundColor: 'rgba(6,81,128,1.0)' },
    { backgroundColor: 'rgba(254,162,32,1.0)' },
    { backgroundColor: 'rgba(46,177,52,1.0)' },
    { backgroundColor: 'rgba(27,141,205,1.0)' }
  ];

  /* Line Graph Properties */
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0,
        fill: false
      }
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return tooltipItem.yLabel + 'kwh';
        }
      }
    },
    scales: {
      xAxes: [{
        display: true
      }],
      yAxes: [{
        display: false
      }]
    }
  };
  public lineChartData = [];
  public lineChartColors: Array<any> = [
    { borderColor: 'rgba(6,81,128,1.0)', backgroundColor: 'rgba(6,81,128,1.0)' },
    { borderColor: 'rgba(254,162,32,1.0)', backgroundColor: 'rgba(254,162,32,1.0)' },
    { borderColor: 'rgba(46,177,52,1.0)', backgroundColor: 'rgba(46,177,52,1.0)' },
    { borderColor: 'rgba(27,141,205,1.0)', backgroundColor: 'rgba(27,141,205,1.0)' }
  ];

  /* Table and Pagination Data */
  public tablePage = 1;
  public isDataAvailable = false;
  public tableData: any[] = [];

  private ServiceAccountsSubscription: Subscription = null;

  constructor(
    private usageHistoryService: UsageHistoryService,
    private ServiceAccountService: ServiceAccountService
  ) {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.getUsageHistoryByServiceAccountId();
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

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getUsageHistoryByServiceAccountId() {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsageHistory(toNumber(this.activeServiceAccount.Id))
        .subscribe(usageHistory => this.populateCharts(usageHistory));
    }
  }

  // Fetch labels and data from api response and show it on the charts
  populateCharts(usageHistory) {

    this.tableData = usageHistory;

    const datagroups = {};
    let tempYear: string;
    let tempMonth: number;

    usageHistory.sort((a, b) => b.date - a.date);

    // Put data from api into array
    for (let i = 0; i < usageHistory.length ; i++) {
      tempYear = usageHistory[i].date.getFullYear().toString();
      tempMonth = usageHistory[i].date.getMonth();

      if (!datagroups[tempYear]) {
        datagroups[tempYear] = { data: [], label: tempYear };
      }
      datagroups[tempYear].data.push(usageHistory[i].usage);
    }

    // Pad the first year with nulls so the data lines up with the labels
    for (let i = tempMonth; i > 0; i--) {
      datagroups[tempYear].data.push(null);
    }

    // Reverse data so it matches the labels
    for (const key in datagroups) {
      if (datagroups[key]) {
        datagroups[key].data = reverse(datagroups[key].data);
      }
    }

    const dataToDisplay = takeRight(values(datagroups), 4);

    while (this.barChartData.length) { this.barChartData.pop(); }
    while (this.lineChartData.length) { this.lineChartData.pop(); }

    this.barChartData.push(dataToDisplay);
    this.lineChartData.push(dataToDisplay);

    this.isDataAvailable = true;
  }

}
