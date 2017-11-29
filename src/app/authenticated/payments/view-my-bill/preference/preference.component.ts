import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { NotificationOptionsStore } from '../../../../core/store/notificationoptionsstore';
import { INotificationOption } from '../../../../core/models/notificationoptions/notificationoption.model';
import { NotificationStatus } from '../../../../core/models/enums/notificationstatus';

@Component({
  selector: 'mygexa-view-my-bill-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit, OnDestroy {

  public serviceAccountDetails: ServiceAccount = null;
  private ActiveServiceAccountSubscription: Subscription = null;
  NotificationOptionsStoreSubscription: Subscription = null;
  NotificationOptions: INotificationOption = null;
  Paperless_Billing: boolean = null;

  constructor(private ServiceAccountService: ServiceAccountService,
              private NotificationOptionsStore: NotificationOptionsStore,
  ) {
  }

  ngOnInit() {
    // Get the preference from the Service_Account API:
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.serviceAccountDetails = result;
        if (result) {
          this.NotificationOptionsStoreSubscription = this.NotificationOptionsStore.Notification_Options.subscribe(
            Options => {
              if (Options && Options.length > 0) {
                this.NotificationOptions = Options[0];
                if (String(this.NotificationOptions.Status) === NotificationStatus[NotificationStatus.Active]) {
                  this.Paperless_Billing = Boolean(this.NotificationOptions.Paperless);
                }
              }
            }
          );
        }
      });
  }

  ngOnDestroy() {
    if (this.ActiveServiceAccountSubscription) {
      this.ActiveServiceAccountSubscription.unsubscribe();
    }
    if (this.NotificationOptionsStoreSubscription) {
      this.NotificationOptionsStoreSubscription.unsubscribe();
    }
  }
}
