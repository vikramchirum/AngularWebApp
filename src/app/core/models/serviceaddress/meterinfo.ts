/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import {MeterType} from '../enums/metertype';
import {MeterStatus} from '../enums/meterstatus';
import {PremiseType} from '../enums/premisetype';

export interface IMeterInfo {
  UAN: string;
  Meter_Type: MeterType;
  Meter_Status: MeterStatus;
  Premise_Type: PremiseType;
  TDU_DUNS: string;
}
