/**
 * Created by vikram.chirumamilla on 9/8/2017.
 */

import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';

import { IContactUsRequest } from './models/messagecenter/contactusrequest.model';
import { IContactUsResponse } from './models/messagecenter/contactusresponse';

@Injectable()
export class MessageCenterService {

  constructor(private http: HttpClient) {
  }

  contactus(contactUsRequest: IContactUsRequest): Observable<boolean> {
    const relativePath = `/messagecenter/contactus/`;
    return this.http.post(relativePath, contactUsRequest)
      .map((response: Response) => {
        const result = <IContactUsResponse> response.json();
        return result.IsSuccess;
      })
      .catch(error => this.http.handleHttpError(error));
  }
}
