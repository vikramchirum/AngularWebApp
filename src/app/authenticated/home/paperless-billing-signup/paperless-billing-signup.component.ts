import {Component, Input, OnInit} from '@angular/core';

import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';

@Component({
  selector: 'mygexa-paperless-billing-signup',
  templateUrl: './paperless-billing-signup.component.html',
  styleUrls: ['./paperless-billing-signup.component.scss']
})
export class PaperlessBillingSignupComponent implements OnInit {

  @Input('parentComponent')
  public parentComponent: string = null;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
  }

  ngOnInit() {
  }

  public handleClick() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[this.parentComponent], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SignupPaperlessBilling]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SignupPaperlessBilling]);
  }
}
