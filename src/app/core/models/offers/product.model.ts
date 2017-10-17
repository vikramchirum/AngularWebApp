
import {IPricing} from './pricing.model';

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
  Product_Features: string[];
  Usage_Profile: string;
  Featured_Usage_Level: string;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}
