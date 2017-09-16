/**
 * Created by vikram.chirumamilla on 9/15/2017.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ModalStore {

  private _renewalConfirmationModal: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
  }

  get RenewalConfirmationModal() {
    return this._renewalConfirmationModal.asObservable().filter(x => x != null);
  }

  showRenewalConfirmationModal(input: any) {
    this._renewalConfirmationModal.next(input);
  }
}
