import { Component, OnInit } from '@angular/core';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { takeRight, reverse, size, values } from 'lodash';

interface ChartDataSet {
  data: any[];
  year: string;
}

@Component({
  selector: 'mygexa-usage-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.scss'],
  providers: [UsageHistoryService]
})
export class UsageHistoryComponent implements OnInit {

  billingAccountId: number = null;

  public isDataAvailable: boolean = false;
  public tableData: any[] = [];

  /* Bar Graph Properties */
  public barChartOptions: any = {
    responsive: true,
    barThickness: 2,
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
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: ChartDataSet[];
  //  {data: [47, 55, 61, 55, 49, 53, 53, 61, 54, 49, 57, 47], label: '2015'},
  //   {data: [48, 53, 60, 56, 48, 55, 54, 63, 57, 51, 54, 46], label: '2016'},
  //   {data: [47, 54, 57, 53, 52, 52, 51, 60, 58, 50, 56, 49], label: '2017'},
  //   {data: [49, 52, 65, 56, 49, 54, 50, 62, 56, 51, 53, 49], label: '2018'}
  // ];
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
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public lineChartLabels: string[] = [];
  public lineChartData: ChartDataSet[];
  //   [
  //   {data: [235, 240, 236, 241, 243, 238, 242, 235, 240, 236, 241, 243], label: '2015', fill: false},
  //   {data: [234, 242, 237, 238, 241, 237, 240, 234, 242, 237, 238, 241], label: '2016', fill: false},
  //   {data: [238, 235, 240, 236, 240, 242, 243, 238, 235, 240, 236, 240], label: '2017', fill: false},
  //   {data: [237, 236, 240, 235, 242, 238, 240, 237, 239, 241, 238, 243], label: '2018', fill: false}
  // ];
  public lineChartColors: Array<any> = [
    { borderColor: '#7FFFD4', backgroundColor: '#7FFFD4' },
    { borderColor: '#32CD32', backgroundColor: '#32CD32' },
    { borderColor: '#98FB98', backgroundColor: '#98FB98' },
    { borderColor: '#6495ED', backgroundColor: '#6495ED' }
  ];

  /* Table and Pagination Data */
  public tablePage: number = 1;

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

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(private usageHistoryService: UsageHistoryService) { }

  ngOnInit() {
    this.getUsageHistoryByBillingAccountId();
  }


  getUsageHistoryByBillingAccountId() {

    // Test Accounts - 913064, 1408663, 830688, 1047431, 1340673 : CustomerId - 342802

    this.billingAccountId = 1408663; // test

    this.usageHistoryService.getUsageHistory(this.billingAccountId)
      .subscribe(usageHistory => this.populateCharts(usageHistory));
  }

  // Fetch labels and data from api response and show it on the charts
  populateCharts(usageHistory) {
    this.tableData = usageHistory;

    const datagroups = {};
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];
    let tempYear: string;

    usageHistory.sort((a, b) => b.Usage_Month - a.Usage_Month);

    // Put data from api into array
    for (let i = 0; i < usageHistory.length ; i++) {
      tempYear = usageHistory[i].Usage_Month.getFullYear().toString();

      if (!datagroups[tempYear]) {
        datagroups[tempYear] = { data: [], label: tempYear };
      }
      datagroups[tempYear].data.push(usageHistory[i].Usage);
    }

    // Pad the first year with nulls so the data lines up with the labels
    for (let i = 12 - datagroups[tempYear].data.length; i > 0; i--) {
      datagroups[tempYear].data.push(null);
    }

    // Reverse data so it matches the labels
    for (const key in datagroups) {
      if (datagroups[key]) {
        datagroups[key].data = reverse(datagroups[key].data);
      }
    }

    // Print data to the charts
    this.barChartData = <ChartDataSet[]>takeRight(values(datagroups), 4);
    this.barChartLabels = monthNames;

    this.lineChartData = <ChartDataSet[]>takeRight(values(datagroups), 4);
    this.lineChartLabels = monthNames;

    this.isDataAvailable = true;
  }

}
