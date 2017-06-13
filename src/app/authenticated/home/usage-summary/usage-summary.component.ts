import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-usage-summary',
  templateUrl: './usage-summary.component.html',
  styleUrls: ['./usage-summary.component.scss']
})
export class UsageSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false
  };
  public barChartLabels: string[] = ['April', 'May', 'June'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [20, 65, 40, 0], label: 'Energy Consumption' },
    // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  public barChartColors: any[] = [
    {
      backgroundColor: '#959595',
      borderColor: '#000000',
      borderWidth: 1,
    }
  ]

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



}
