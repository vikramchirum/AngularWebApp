import {Component, Input, OnInit} from '@angular/core';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

@Component({
  selector: 'mygexa-energy-saving-tips',
  templateUrl: './energy-saving-tips.component.html',
  styleUrls: ['./energy-saving-tips.component.scss']
})
export class EnergySavingTipsComponent implements OnInit {

  @Input('parentComponent')
  public parentComponent: string = null;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
  }

  ngOnInit() {
  }

  public handleClick() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[this.parentComponent], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.EnergySavingTips]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.EnergySavingTips]);
  }
}
