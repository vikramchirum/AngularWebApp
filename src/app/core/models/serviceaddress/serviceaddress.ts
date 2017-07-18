/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import {IAddress} from '../address/address';
import {IMeterInfo} from './meterinfo';

export interface IServiceAddress {
  Address: IAddress;
  Meter_Info: IMeterInfo;
}
