/**
 * Created by vikram.chirumamilla on 9/16/2017.
 */

import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';

import { IRenewal } from './models/renewals/renewal.model';
import { ICreateUpgradeRequest } from './models/upgrades/createupgraderequest.model';

@Injectable()
export class UpgradeService {

  constructor(private http: HttpClient) {
  }

  createUpgrade(request: ICreateUpgradeRequest): Observable<IRenewal> {
    const body = JSON.stringify(request);
    const relativePath = `/upgrades/${request.Service_Account_Id}/create_upgrade`;
    return this.http.post(relativePath, body)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }
}
