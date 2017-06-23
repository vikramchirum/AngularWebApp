import { Component, OnInit } from '@angular/core';
import { UsageHistoryService } from '../../../core/usage-history.service';
import { UsageHistory } from '../../../core/models/usage-history.model'



interface chartDataSet {
  data: number[];
  label: string;
}

@Component({
  selector: 'mygexa-usage-summary',
  templateUrl: './usage-summary.component.html',
  styleUrls: ['./usage-summary.component.scss'],
  providers: [UsageHistoryService]
})

export class UsageSummaryComponent implements OnInit {

  usageHistory: UsageHistory[] = null;
  billingAccountId: number = null;

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
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public isDataAvailable: boolean = false;

  public barChartData: chartDataSet[];
  //   { data: [20, 65, 40, 0], label: 'Energy Consumption' },
  //   // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  // ];

  public barChartColors: any[] = [
    {
      backgroundColor: '#959595',
      borderColor: '#000000',
      borderWidth: 1,
    }
  ]

  constructor(private usageHistoryService: UsageHistoryService) { }

  ngOnInit() {
    this.getUsageHistoryByBillingAccountId();
  }



  getUsageHistoryByBillingAccountId() {

    //TODO: get AccountId on selection of billing Account associated with the customerId
    //Test Accounts - 913064, 1408663, 830688, 1047431, 1340673 : CustomerId - 342802 

    this.billingAccountId = 913064; // test

    this.usageHistoryService.getUsageHistory(this.billingAccountId)
      .subscribe(usageHistory => this.populateChart(usageHistory))
  }

  //Fetching labels and data from api response and to show it on chart.
  populateChart(usageHistory) {
    let labels: string[] = [];
    let yAxisdata: number[] = [];
    let datasetLabel: string;
    usageHistory.sort(function (a, b) {
      return b.Usage_Month - a.Usage_Month;
    });

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Novr", "Dec"];
    //last 3 months data
    for (var i = 0; i < 3; i++) {
      labels.push(monthNames[usageHistory[i].Usage_Month.getMonth()]);
      yAxisdata.push(usageHistory[i].Usage);
    }

    this.barChartData = [{
      data: yAxisdata,
      label: 'Energy Consumption'
    }]

    this.barChartLabels = labels;
    this.isDataAvailable = true;

  }



  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



}
