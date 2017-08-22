import { IRenewal } from './renewal.model';
/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IRenewalDetails {
  Service_Account_Id: number;
  Service_Account_Status: string;
  Is_Account_Eligible_Renewal: boolean;
  Is_Pending_Renewal: boolean;
  Is_MoveOut_Scheduled: boolean;
  Contract_EndDate?: Date;
  TDU_DUNS_Number: string;
  Remaining_ContractTerm_In_Days?: number;
  Existing_Renewal: IRenewal;
}
