import { Component, OnInit } from '@angular/core';

import { slice } from 'lodash';
import MockData from 'app/authenticated/payments/payment-history/bills/bills.mock-data.json';

@Component({
  selector: 'mygexa-usage-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.scss']
})
export class UsageHistoryComponent implements OnInit {

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
        display: false
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

  public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    {data: [47, 55, 61, 55, 49, 53, 53, 61, 54, 49, 57, 47], label: '2015'},
    {data: [48, 53, 60, 56, 48, 55, 54, 63, 57, 51, 54, 46], label: '2016'},
    {data: [47, 54, 57, 53, 52, 52, 51, 60, 58, 50, 56, 49], label: '2017'},
    {data: [49, 52, 65, 56, 49, 54, 50, 62, 56, 51, 53, 49], label: '2018'}
  ];

  public barChartColors: any[] = [
    { backgroundColor: '#7FFFD4' },
    { backgroundColor: '#32CD32' },
    { backgroundColor: '#98FB98' },
    { backgroundColor: '#6495ED' }
  ]

  /* Line Graph Properties */
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0,
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
        display: false
      }],
      yAxes: [{
        display: false
      }]
    }
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public tableData = MockData;
  public totalItems: number = MockData.length;
  public tablePage: number = 1;

  public lineChartData: Array<any> = [
    {data: [235, 240, 236, 241, 243, 238, 242, 235, 240, 236, 241, 243], label: '2015', fill: false},
    {data: [234, 242, 237, 238, 241, 237, 240, 234, 242, 237, 238, 241], label: '2016', fill: false},
    {data: [238, 235, 240, 236, 240, 242, 243, 238, 235, 240, 236, 240], label: '2017', fill: false},
    {data: [237, 236, 240, 235, 242, 238, 240, 237, 239, 241, 238, 243], label: '2018', fill: false}
  ];

  public lineChartColors: Array<any> = [
    { borderColor: '#7FFFD4', backgroundColor: '#7FFFD4' },
    { borderColor: '#32CD32', backgroundColor: '#32CD32' },
    { borderColor: '#98FB98', backgroundColor: '#98FB98' },
    { borderColor: '#6495ED', backgroundColor: '#6495ED' }
  ];

  private getEntries(page: number) {
    const index = (page - 1) * 10;
    const extent = index + 10;
    if (extent > MockData.length) {
      return MockData.slice(index);
    }
    return MockData.slice(index, extent);
  }

  get currentPage() {
    const pageEntries = this.getEntries(this.tablePage);
    const dateObj = new Date('2017-06-15T21:19:18.349Z');
    console.log(dateObj.getFullYear());
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

  constructor() { }

  ngOnInit() {
  }

}
