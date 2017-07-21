
import { assign } from 'lodash';

export interface OfferRequest {
    startDate: string;
    dunsNumber: string;
}

export class AllOffersClass {
  Type: string;
  Offers: [ IOffers ];

  /**
   * Construct a new AllOffersClass passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);
  }


}

export interface IOffers {
  Promotion: IPromotion;
  Plan: IPlan;
  Channel: [ IFeaturedChannels ];
   Start_Date: string;
   End_Date: string;
   Rate_Code: string;
   Approved: boolean;
   Price_At_500_kwh: number;
   Price_At_1000_kwh: number;
   Price_At_2000_kwh: number;
   Actual_Pricing: IPricingDefinition;
   Credit_Check_Required: boolean;
   Id: string;
   Creation_Time: string;
   Date_Created: string;
   Date_Last_Modified: string;
}


 export interface IPromotion {
  Name: string;
  Description: string;
  Code: string;
  Rate_Code_Id: string;
  Attributes: [ IAttributes ];
  Incentives: [ IIncentives ];
  Offers_Not_Matching_Pricing: number;
  Offers_Not_Matching: number;
  Id: string;
  Creation_Time: string;
  Date_Last_Modified: string;
  Date_Created: string;
}


export interface IAttributes {
  Type: string;
  Value: string;
}

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


export interface IPartnerInfo {
    Partner: IPartner;
    Code: string;
}

export interface IPartner {
  Description: string;
  Billing_Code: string;
  Id: string;
  Creation_Time: string;
  Name: string;
  Date_Created: string;
  Date_Last_Modified: string;
}

export interface IPlan {
  Name: string;
  Product: IProduct;
  TDU: ITDU;
  Term: number;
  Acquisition: boolean;
  Pricing_Definition: IPricingDefinition;
  Incentive_Items: [ IIncentives ];
  Featured_Channels: [ IFeaturedChannels ];
  Is_Pricing_Valid: boolean;
  Offers_Not_Matching_Pricing: number;
  Offers_Not_Matching: number;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}

export interface IProduct {
  Name: string;
  Description: string;
  Fixed: boolean;
  Bundled: boolean;
  Plans_Count: number;
  Rate_Code_Id: string;
  Tiered: boolean;
  Usage_Credit: boolean;
  Usage_Charge: boolean;
  Renewable_Percentage: number;
  Green_Percentage: number;
  Pricing: IPricing;
  Product_Family: string;
  Usage_Profile: string;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}

export interface IPricing {
  Has_Early_Termination_Fee: boolean;
  Has_Base_Charge: boolean;
  Has_Monthly_Service_Fees: boolean;
  Energy_Charge_Count: number;
  Usage_Credit_Count: number;
  Usage_Charge_Count: number;
}

export interface ITDU {
  Name: string;
  Abbreviation: string;
  Duns_Number: string;
  Billing_System_Name: string;
  Rate_Code_Id: string;
  Priority_Move_In_Fee_Existing_Meter: number;
  Priority_Move_In_Fee_New_Meter: number;
  Standard_Move_In_Fee_Existing_Meter: number;
  Standard_Move_In_Fee_New_Meter: number;
  Self_Selected_Switch_Fee: number;
  Credit_Check_Required: boolean;
  Bill_Type: string;
  Meter_Charge: number;
  Delivery_Charge: number;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}

export interface IPricingDefinition {
  Early_Termination_Fee: number;
  Base_Charge: number;
  Energy_Charges: [ ICharges ];
  Usage_Credits: [ ICharges ];
  Usage_Charges: [ ICharges ];
  Has_Early_Termination_Fee: boolean;
  Has_Base_Charge: boolean;
  Has_Monthly_Service_Fees: boolean;
  Energy_Charge_Count: number;
  Usage_Credit_Count: number;
  Usage_Charge_Count: number;
}

export interface ICharges {
  Min: number;
  Max: number;
  Amount: number;
}

export interface IFeaturedChannels {
  Name: string;
  Description: string;
  Internal: boolean;
  Billing_Id: string;
  Client_Email_Addresses: [ string ];
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}
