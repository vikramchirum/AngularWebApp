import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

@Component({
  selector: 'mygexa-refer-friend-program',
  templateUrl: './refer-friend-program.component.html',
  styleUrls: ['./refer-friend-program.component.scss']
})
export class ReferFriendProgramComponent implements OnInit, OnDestroy {
  serviceAccountServiceSubscription: Subscription = null;
  ActiveServiceAccount: ServiceAccount = null;
  IsDisconnectedServiceAddress: boolean = null;

  @Input('parentComponent')
  public parentComponent: string = null;

  constructor(private ServiceAccountService: ServiceAccountService, private googleAnalyticsService: GoogleAnalyticsService) {
  }

  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        if (this.ActiveServiceAccount) {
          this.IsDisconnectedServiceAddress = this.ActiveServiceAccount.Status === 'Disconnected' ? true : false;
        }
      });
  }

  ngOnDestroy() {
    if (this.serviceAccountServiceSubscription) {
      this.serviceAccountServiceSubscription.unsubscribe();
    }
  }

  public handleClick() {
    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[this.parentComponent], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ReferaFriend]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.ReferaFriend]);
  }
}
