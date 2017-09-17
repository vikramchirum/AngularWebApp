/**
 * Created by vikram.chirumamilla on 9/15/2017.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ModalStore {

  private _planConfirmationModal: BehaviorSubject<any> = new BehaviorSubject(null);

  private _handleOfferPopOversModal: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
  }

  get PlanConfirmationModal() {
    return this._planConfirmationModal.asObservable().filter(x => x != null);
  }

  get HandleOfferPopOversModal() {
    return this._handleOfferPopOversModal.asObservable().filter(x => x != null);
  }

  handleOfferPopOversModal(input: string) {
    this._handleOfferPopOversModal.next(input);
  }

  showPlanConfirmationModal(input: any) {
    this._planConfirmationModal.next(input);
  }
}
