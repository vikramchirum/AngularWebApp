import { Component, OnDestroy } from '@angular/core';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { takeRight, toNumber, reverse, values } from 'lodash';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-usage-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.scss'],
  providers: [UsageHistoryService]
})
export class UsageHistoryComponent implements OnDestroy {

  activeBillingAccount: BillingAccountClass = null;

  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

  /* Bar Graph Properties */
  public barChartOptions: any = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
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
    { backgroundColor: '#7FFFD4' },
    { backgroundColor: '#32CD32' },
    { backgroundColor: '#98FB98' },
    { backgroundColor: '#6495ED' }
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
        label: (tooltipItem, data) => {
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
    { borderColor: '#7FFFD4', backgroundColor: '#7FFFD4' },
    { borderColor: '#32CD32', backgroundColor: '#32CD32' },
    { borderColor: '#98FB98', backgroundColor: '#98FB98' },
    { borderColor: '#6495ED', backgroundColor: '#6495ED' }
  ];

  /* Table and Pagination Data */
  public tablePage: number = 1;
  public isDataAvailable: boolean = false;
  public tableData: any[] = [];

  private BillingAccountsSubscription: Subscription = null;

  constructor(
    private usageHistoryService: UsageHistoryService,
    private BillingAccountService: BillingAccountService
  ) {
    this.BillingAccountsSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => {
        this.activeBillingAccount = activeBillingAccount;
        this.getUsageHistoryByBillingAccountId();
      }
    );
  }

  ngOnDestroy() {
    // Clean up our subscribers to avoid memory leaks.
    this.BillingAccountsSubscription.unsubscribe();
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
    const pageEntries = this.getEntries(this.tablePage);
    return pageEntries;
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

  getUsageHistoryByBillingAccountId() {
    if (this.activeBillingAccount) {
      this.usageHistoryService.getUsageHistory(toNumber(this.activeBillingAccount.Id))
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
