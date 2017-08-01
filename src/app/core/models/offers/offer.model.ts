/**
 * Created by vikram.chirumamilla on 7/28/2017.
 */

import {OfferCharge} from './offercharge';

export interface Offer {
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
  Family: String;
  Family_String: string;
  Early_Termination_Fee: number;
  Base_Charge: number;
  Energy_Charges: [OfferCharge];
  Usage_Credits: [OfferCharge];
  Usage_Charges: [OfferCharge];
  Start_Date: string;
  End_Date: string;
}
