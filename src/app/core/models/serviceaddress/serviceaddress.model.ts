/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import {assign} from 'lodash';

import {IAddress, addressString} from '../address/address.model';
import {IMeterInfo} from './meterinfo.model';

export class ServiceAddress {

  Address: IAddress;
  Meter_Info: IMeterInfo;

  constructor(opts: any) {
    assign(this, opts);
  }

  newAddressString(): string {
    return addressString(this.Address);
  };
}
