/**
 * Created by vikram.chirumamilla on 9/6/2017.
 */

import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';

import { IReferral } from './models/referrals/referral.model';
import { IEnrollReferralRequest } from './models/referrals/enrollreferralrequest.model';
import {IInviteRefereeRequest} from './models/referrals/inviterefereesrequest.model';

@Injectable()
export class ReferralService {

  constructor(private http: HttpClient) {
  }

  getReferral(customerAccountId: string): Observable<IReferral> {
    const relativePath = `/referrals?customer_account_id=${customerAccountId}`;
    return this.http.get(relativePath)
      .map((response: Response) => {
        return <IReferral> response.json();
      })
      .catch(error => this.http.handleHttpError(error));
  }

  enrollReferral(request: IEnrollReferralRequest): Observable<IReferral> {
    const relativePath = `/referrals/`;
    return this.http.post(relativePath, request)
      .map((response: Response) => {
        return <IReferral> response.json();
      })
      .catch(error => this.http.handleHttpError(error));
  }

  changeRewardPreferences(request: IEnrollReferralRequest): Observable<IReferral> {
    const relativePath = `/referrals/`;
    return this.http.put(relativePath, request)
      .map((response: Response) => {
        return <IReferral> response.json();
      })
      .catch(error => this.http.handleHttpError(error));
  }

  inviteReferees(request: IInviteRefereeRequest): Observable<string> {
    const relativePath = `/referrals/FriendsFamilyInvite/`;
    return this.http.post(relativePath, request)
      .map((response: Response) => {
        return <IReferral> response.json();
      })
      .catch(error => this.http.handleHttpError(error));
  }
}
