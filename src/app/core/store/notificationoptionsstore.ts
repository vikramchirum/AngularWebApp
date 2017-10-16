import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { INotificationOption } from '../models/notificationoptions/notificationoption.model';
import { NotificationOptionsService } from '../notificationoptions.service';
import { Observable } from 'rxjs/Observable';
import { ISearchNotificationOptionRequest } from '../models/notificationoptions/searchnotificationoptionrequest.model';

@Injectable()

export class NotificationOptionsStore {
private _notificationOptions: BehaviorSubject<INotificationOption[]> = new BehaviorSubject(null);
  constructor(private notificationOptionsService: NotificationOptionsService) {}

  get Notification_Options() {
    return this._notificationOptions.asObservable();
  }

  LoadNotificationOptions(searchOption: ISearchNotificationOptionRequest) {
    this.notificationOptionsService.searchNotificationOption(searchOption).subscribe(
      NotificationOption => {
        this._notificationOptions.next(NotificationOption);
      }
    );
  }
}




