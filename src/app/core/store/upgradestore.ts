/**
 * Created by vikram.chirumamilla on 9/16/2017.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { IRenewal } from '../models/renewals/renewal.model';
import { RenewalStore} from './renewalstore';
import { ICreateUpgradeRequest} from '../models/upgrades/createupgraderequest.model';
import { UpgradeService} from '../upgrade.service';


@Injectable()
export class UpgradeStore {

  constructor(private upgradeService: UpgradeService, private renewalStore: RenewalStore) {
  }

  createUpgrade(request: ICreateUpgradeRequest): Observable<IRenewal> {
    const observable = this.upgradeService.createUpgrade(request).share();
    observable.subscribe(
      Renewal => {
        console.log('Upgrade Successfully Created with Renewal Id' + Renewal.Id);
        this.renewalStore.LoadRenewalDetails(request.Service_Account_Id);
      },
      err => {
        Observable.throw(err);
      }
    );
    return observable;
  }
}
