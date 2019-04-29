import { Component, OnDestroy, ViewChild } from '@angular/core';

import { startsWith } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Router } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'mygexa-controls-and-insights',
  templateUrl: './controls-and-insights.component.html',
  styleUrls: ['./controls-and-insights.component.scss']
})
export class ControlsAndInsightsComponent implements OnDestroy {

  @ViewChild("baseChart") chart: BaseChartDirective;

  public isRTP: boolean;
  public startsWith = startsWith;
  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;

  public sideNavData = {
    'panelTitle': 'Energy Insights',
    'items': [
      { 'title': 'Power Usage Tracker', 'navUrl': 'power-usage-tracker'},
      { 'title': 'Usage History', 'navUrl': 'usage-history'},
      { 'title': 'Energy Savings Tips', 'navUrl': 'energy-savings-tips'}
    ]
  };

  constructor(
    private ServiceAccountService: ServiceAccountService,
    public Router: Router
  ) {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.isRTP = this.activeServiceAccount.Current_Offer.Is_RTP;
        // TODO if isRTP
        this.sideNavData.items.splice(2, 0, { 'title': 'Savings', 'navUrl': 'savings' });
      }
    );
  }

  ngOnDestroy() {
    // Clean up our subscribers to avoid memory leaks.
    this.ServiceAccountsSubscription.unsubscribe();
  }
}
