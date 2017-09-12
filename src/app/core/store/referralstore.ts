/**
 * Created by vikram.chirumamilla on 9/6/2017.
 */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { ReferralService } from '../referral.service';
import { IReferral } from '../models/referrals/referral.model';
import { IEnrollReferralRequest } from '../models/referrals/enrollreferralrequest.model';

@Injectable()
export class ReferralStore {

  private _referral: BehaviorSubject<IReferral> = new BehaviorSubject(null);

  constructor(private referralService: ReferralService) {
  }

  get Referral() {
    return this._referral.asObservable().filter(referral => referral != null);
  }

  loadReferral(customerAccountId: string) {
    this.referralService.getReferral(customerAccountId)
      .subscribe(
        referral => {
          this._referral.next(referral);
        });
  }

  enrollReferral(request: IEnrollReferralRequest): Observable<boolean> {
    const observable = this.referralService.enrollReferral(request);
    observable.subscribe(
      referral => {
        console.log('Referral Successfully Created');
        this.loadReferral(request.Service_Account_Id);
      }
    );
    return Observable.of(true);
  }
}
