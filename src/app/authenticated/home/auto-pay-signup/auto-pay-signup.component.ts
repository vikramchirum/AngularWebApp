import {Component, Input, OnInit} from '@angular/core';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

@Component({
  selector: 'mygexa-auto-pay-signup',
  templateUrl: './auto-pay-signup.component.html',
  styleUrls: ['./auto-pay-signup.component.scss']
})
export class AutoPaySignupComponent implements OnInit {

  @Input('parentComponent')
  public parentComponent: string = null;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
  }

  public handleClick() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[this.parentComponent], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SignupAutoPay]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SignupAutoPay]);
  }
}
