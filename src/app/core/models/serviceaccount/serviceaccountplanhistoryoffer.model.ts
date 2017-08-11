/**
 * Created by vikram.chirumamilla on 7/27/2017.
 */

import {IServiceAccountPlanHistoryOfferCharge} from './serviceaccountplanhistoryoffercharge.model';

export interface IServiceAccountPlanHistoryOffer {
  Rate_Code: string;
  Client_Key: string;
  Promotion_Name: string;
  Promotion_Code: string;
  Product_Name: string;
  Product_Description: string;
  RateAt500kwh: number;
  RateAt1000kwh: number;
  RateAt2000kwh: number;
  Term: number;
  TDU_Name: string;
  TDU_DUNS_Number: string;
  Meter_Charge: number;
  Delivery_Charge: number;
  Early_Termination_Fee: number;
  Base_Charge: number;
  Energy_Charges: [IServiceAccountPlanHistoryOfferCharge];
  Usage_Credits: [IServiceAccountPlanHistoryOfferCharge];
  Usage_Charges: [IServiceAccountPlanHistoryOfferCharge];
  Start_Date: string;
  End_Date: string;
  IsHoldOverRate: boolean;
}
