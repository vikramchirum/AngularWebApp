/**
 * Created by vikram.chirumamilla on 7/21/2017.
 */

import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';
import { INotificationOption } from './models/notificationoptions/notificationoption.model';
import { ISearchNotificationOptionRequest } from './models/notificationoptions/searchnotificationoptionrequest.model';

@Injectable()
export class NotificationOptionsService {

  constructor(private http: HttpClient) {
  }

  getNotificationOption(id: string): Observable<INotificationOption>   {
    const relativePath = `/Notification_Options/${id}`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <INotificationOption> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  searchNotificationOption(searchRequest: ISearchNotificationOptionRequest): Observable<INotificationOption[]> {

    const params: URLSearchParams = new URLSearchParams();
    for (const key in searchRequest) {
      if (searchRequest.hasOwnProperty(key)) {
        const val = searchRequest[key];
        params.set(key, val);
      }
    }

    const relativePath = `/Notification_Options/`;
    return this.http.get(relativePath, params)
      .map((response: Response) => { return <INotificationOption[]> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  createNotificationOption(request: INotificationOption): Observable<INotificationOption> {
    const body = JSON.stringify(request);
    const relativePath = `/Notification_Options/`;
    return this.http.post(relativePath, body)
      .map((response: Response) => { return <INotificationOption> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  updateNotificationOption(request: INotificationOption): Observable<INotificationOption> {
    const body = JSON.stringify(request);
    const relativePath = `/Notification_Options/`;
    return this.http.put(relativePath, body)
      .map((response: Response) => { return <INotificationOption> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }
}
