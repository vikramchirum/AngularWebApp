/**
 * Created by vikram.chirumamilla on 8/31/2017.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import { RenewalService } from '../renewal.service';
import { IRenewalDetails } from '../models/renewals/renewaldetails.model';
import { ICreateRenewalRequest } from '../models/renewals/createrenewalrequest.model';
import { IRenewal } from '../models/renewals/renewal.model';
import { ICancelRenewalRequest } from '../models/renewals/cancelrenewalrequest.model';

@Injectable()
export class RenewalStore {

  private _renewalDetails: BehaviorSubject<IRenewalDetails> = new BehaviorSubject(null);

  constructor(private renewalService: RenewalService) {
  }

  get RenewalDetails() {
    return this._renewalDetails.asObservable().filter(renewalDetails => renewalDetails != null);
  }

  LoadRenewalDetails(serviceAccountId: string) {
    this.renewalService.getRenewalDetails(serviceAccountId)
      .subscribe(
        RenewalDetails => {
          this._renewalDetails.next(RenewalDetails);
        });
  }

  createRenewal(request: ICreateRenewalRequest): Observable<IRenewal> {
    const observable = this.renewalService.createRenewal(request).share();
    observable.subscribe(
      Renewal => {
        console.log('Renewal Successfully Created with renewal Id' + Renewal.Id);
        this.LoadRenewalDetails(request.Service_Account_Id);
      },
      err => {
        Observable.throw(err);
      }
    );
    return observable;
  }

  cancelRenewal(request: ICancelRenewalRequest): Observable<boolean> {
    const observable = this.renewalService.cancelRenewal(request);
    observable.subscribe(
      status => {
        console.log('Renewal Successfully canceled with status ' + status);
        this.LoadRenewalDetails(request.Service_Account_Id);
      }
    );
    return observable;
  }

}
