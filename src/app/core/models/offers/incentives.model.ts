/**
 * Created by vikram.chirumamilla on 7/28/2017.
 */

import {IPartnerInfo} from './partnerinfo.model';

export interface IIncentives {
  Name: string;
  Description: string;
  Fullfillment_Vendor: string;
  Monetary: boolean;
  Amount: number;
  Partner_Info: IPartnerInfo;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}
