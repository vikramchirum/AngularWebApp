import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-controls-and-insights',
  templateUrl: './controls-and-insights.component.html',
  styleUrls: ['./controls-and-insights.component.scss']
})
export class ControlsAndInsightsComponent implements OnInit {

private sideNavPanelData:any;

  constructor() { }

  ngOnInit() {
    this.sideNavPanelData = {
      'panelTitle':'Control and Insights',
      'items':[
        {
          'title':'Usage History',
          'navUrl':'usage-history'
        }
      ]
    }
  }

  reactToChangedBillingAccount(BillingAccount) {
    console.log(BillingAccount);
  }

}
