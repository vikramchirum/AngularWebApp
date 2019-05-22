import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRTPMonthlySavings } from './models/savings/rtpmonthlysavings.model';


@Injectable()
export class RtpsavingsdetailsService {

  public SavingsInfo: BehaviorSubject<IRTPMonthlySavings> = new BehaviorSubject(null);

  constructor() { }

}
