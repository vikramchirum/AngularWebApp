import { assign } from 'lodash';
import {IRenewalDetails} from './renewaldetails.model';

export class RenewalDetails {
  Renewal_Details: IRenewalDetails;
  constructor(opts: any) {
    assign(this, opts);
  }
}
