/**
 * Created by vikram.chirumamilla on 9/6/2017.
 */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { ReferralService } from '../referral.service';
import { IReferral } from '../models/referrals/referral.model';
import { IEnrollReferralRequest } from '../models/referrals/enrollreferralrequest.model';
import { IInviteRefereeRequest } from '../models/referrals/inviterefereesrequest.model';

@Injectable()
export class ReferralStore {

  private _referral: BehaviorSubject<IReferral> = new BehaviorSubject(null);

  constructor(private referralService: ReferralService) {
  }

  get Referral() {
    return this._referral.asObservable().filter(referral => referral != null);
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

  inviteReferees(request: IInviteRefereeRequest): Observable<true> {
    const observable = this.referralService.inviteReferees(request).share();
    observable.subscribe(result => {
      console.log('Referrals Successfully Invited');
      this.loadReferral(request.Customer_Account_Id);
    });
    return Observable.of(true);
  }
}
