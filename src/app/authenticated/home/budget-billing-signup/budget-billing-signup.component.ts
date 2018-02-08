import {Component, Input, OnInit} from '@angular/core';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import {GoogleAnalyticsService} from 'app/core/googleanalytics.service';

@Component({
  selector: 'mygexa-budget-billing-signup',
  templateUrl: './budget-billing-signup.component.html',
  styleUrls: ['./budget-billing-signup.component.scss']
})
export class BudgetBillingSignupComponent implements OnInit {

  @Input('parentComponent')
  public parentComponent: string = null;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
  }

  public handleClick() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[this.parentComponent], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SignupBudgetBilling]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SignupBudgetBilling]);
  }
}
