/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */
import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';

import { IRenewal } from './models/renewals/renewal.model';
import { ICreateRenewalRequest } from './models/renewals/createrenewalrequest.model';
import { ICancelRenewalRequest} from './models/renewals/cancelrenewalrequest.model';
import { IGetRenewalRequest } from './models/renewals/getrenewalrequest.model';
import { IRenewalDetails } from './models/renewals/renewaldetails.model';

@Injectable()
export class RenewalService {

  constructor(private http: HttpClient) {
  }

  getRenewal(serviceAccountId: string): Observable<IRenewal>   {
    const relativePath = `/renewals/${serviceAccountId}`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  searchRenewal(searchRequest: IGetRenewalRequest): Observable<IRenewal> {

    const params: URLSearchParams = new URLSearchParams();
    for (const key in searchRequest) {
      if (searchRequest.hasOwnProperty(key)) {
        const val = searchRequest[key];
        params.set(key, val);
      }
    }

    const relativePath = `/renewals/`;
    return this.http.get(relativePath, params)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  getRenewalDetails(serviceAccountId: string): Observable<IRenewalDetails>   {
    const relativePath = `/renewals/${serviceAccountId}/details`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <IRenewalDetails> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  createRenewal(request: ICreateRenewalRequest): Observable<IRenewal> {
    const body = JSON.stringify(request);
    const relativePath = `/renewals/${request.Service_Account_Id}/create_renewal`;
    return this.http.post(relativePath, body)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  cancelRenewal(request: ICancelRenewalRequest): Observable<boolean> {
    const body = JSON.stringify(request);
    const relativePath = `/renewals/${request.Service_Account_Id}/cancel_renewal`;
    return this.http.put(relativePath, body)
      .map((response: Response) => { return <boolean> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

}
