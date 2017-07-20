/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import {IAddress} from '../address/address';
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
    return this.addressString('Address');
  };

  /**
   * Returns back a formatted string of either the 'Service_Address' or 'Mailing_Address'.
   * @param type
   * @returns {string | null}
   */
  addressString(address): string {

    if (address
      
    ) {
      return [
        this.Address.Line1,
        this.Address.Line2 &&  this.Address.Line2 !== '' ? ' ' +  this.Address.Line2 : '',
        ', ',
        this.Address.City,
        ', ',
         this.Address.State,
        ' ',
        this.Address.Zip,
        this.Address.Zip_4 &&  this.Address.Zip_4 !== '' ? '-' +  this.Address.Zip_4 : ''
      ].join('');
    }

    return null;

  }




}