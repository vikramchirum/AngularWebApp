
import { Injectable } from '@angular/core';
import { TDUService } from '../tdu.service';
import { ITDU } from '../models/tdu/tdu.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TDUStore {
  private _tduDetails: BehaviorSubject<ITDU[]> = new BehaviorSubject(null);
  constructor(private tduService: TDUService) {
  }
  get TDUDetails() {
    return this._tduDetails.asObservable().filter(tduDetails => tduDetails != null);
  }
  LoadTDUDetails() {
    this.tduService.getTDUS().subscribe(
      TDUDetails => {
        this._tduDetails.next(TDUDetails);
      },
      err => {
        Observable.throw(err);
      }
    );
  }
}

