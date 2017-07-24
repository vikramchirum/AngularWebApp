import {IPartnerInfo} from './partner.model';
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
