/**
 * Created by vikram.chirumamilla on 9/6/2017.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { UtilityService } from '../utility.service';
import { ReferralService } from '../referral.service';

import { IReferral } from '../models/referrals/referral.model';
import { IEnrollReferralRequest } from '../models/referrals/enrollreferralrequest.model';
import { IInviteRefereeRequest } from '../models/referrals/inviterefereesrequest.model';

@Injectable()
export class ReferralStore {

  private _referral: BehaviorSubject<IReferral> = new BehaviorSubject({} as IReferral);

  constructor(private referralService: ReferralService, private utilityService: UtilityService) {
  }

  get Referral() {
    return this._referral.asObservable().filter(referral => {

      if (referral == null) {
        return true;
      }

      const result = referral !== null && !this.utilityService.isNullOrWhitespace(referral.Customer_Account_Id);
      return result;
    });
  }

  loadReferral(customerAccountId: string) {
    // customerAccountId = '218514';
    this.referralService.getReferral(customerAccountId)
      .subscribe(
        referral => {
          this._referral.next(referral);
        });
  }

  enrollReferral(request: IEnrollReferralRequest): Observable<boolean> {
    const observable = this.referralService.enrollReferral(request).share();
    observable.subscribe(
      referral => {
        console.log('Referral Successfully Created');
        this.loadReferral(referral.Customer_Account_Id);
      });

    return Observable.of(true);
  }

  changeRewardPreferences(request: IEnrollReferralRequest): Observable<boolean> {
    const observable = this.referralService.changeRewardPreferences(request).share();
    observable.subscribe(
      referral => {
        console.log('Reward preference Successfully Changed');
        this.loadReferral(referral.Customer_Account_Id);
      });

    return Observable.of(true);
  }

  inviteReferees(request: IInviteRefereeRequest): Observable<true> {
    const observable = this.referralService.inviteReferees(request).share();
    observable.subscribe(result => {
      console.log('Referrals Successfully Invited');
      this.loadReferral(request.Customer_Account_Id);
    });
    return Observable.of(true);
  }
}
