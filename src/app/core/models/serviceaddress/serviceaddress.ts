/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import {IAddress, addressString} from '../address/address';
import {IMeterInfo} from './meterinfo';
import {assign} from 'lodash';

export class ServiceAddress {
  Address: IAddress;
  Meter_Info: IMeterInfo;


  /**
   * Construct a new Billing_Account passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);
  }


  /**
   * Returns back the formatted string of the 'Service_Address'.
   * @returns {string}
   */
  newAddressString(): string {
    return addressString(this.Address);
  };

}