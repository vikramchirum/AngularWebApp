import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';

@Component({
  selector: 'mygexa-moving',
  templateUrl: './moving.component.html',
  styleUrls: ['./moving.component.scss']
})
export class MovingComponent implements OnInit, OnDestroy {
  ServiceAccountSubscription: Subscription;
  IsDisconnectedServiceAddress: boolean = null;
  constructor( private router: Router,
               private ServiceAccountService: ServiceAccountService,
               private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ASA => {
        if (ASA) { this.IsDisconnectedServiceAddress = (ASA.Status === 'Disconnected') ? true : false; }
      }
    );
  }

  ngOnDestroy() {
    if (this.ServiceAccountSubscription) { this.ServiceAccountSubscription.unsubscribe(); }
  }

  public handleGoogleAnalytics() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MovingCenter], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.GetStarted]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.GetStarted]);
    return true;
  }
}
