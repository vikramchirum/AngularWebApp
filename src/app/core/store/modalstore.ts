/**
 * Created by vikram.chirumamilla on 9/15/2017.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ModalStore {

  private _handleOfferPopOversModal: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
  }

  get HandleOfferPopOversModal() {
    return this._handleOfferPopOversModal.asObservable().filter(x => x != null);
  }

  handleOfferPopOversModal(input: string) {
    this._handleOfferPopOversModal.next(input);
  }
}
