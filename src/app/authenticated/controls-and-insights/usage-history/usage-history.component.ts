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

  public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;

  public barChartData: any[] = [
    {data: [47, 55, 60, 56, 49, 55, 53, 61, 54, 49, 57, 47, 55, 60, 56, 49, 55, 53, 61, 54, 49, 57, 47, 55], label: 'Series A'}
  ];

  public barChartColors: any[] = [
    { backgroundColor: '#959595' }
  ]

  /* Line Graph Properties */
  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0, // disables bezier curves
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

  public lineChartData: Array<any> = [
    {data: [235, 240, 236, 241, 243, 238, 242, 235, 240, 236, 241, 243, 238], label: '2015', fill: false},
    {data: [234, 242, 237, 238, 241, 237, 240, 234, 242, 237, 238, 241, 237, 240], label: '2016', fill: false},
    {data: [238, 235, 240, 236, 240, 242, 243, 238, 235, 240, 236, 240, 242, 243], label: '2017', fill: false}
  ];

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

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
