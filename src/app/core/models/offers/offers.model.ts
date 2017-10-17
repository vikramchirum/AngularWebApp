
import {IPromotion} from './promotion.model';
import {IPlan} from './plan.model';
import {IFeaturedChannels} from './featuredchannels.model';
import {IPricingDefinition} from './pricingdefinition.model';

export interface IOffers {
  Promotion: IPromotion;
  Plan: IPlan;
  Channels: [ IFeaturedChannels ];
  Start_Date: string;
  End_Date: string;
  Rate_Code: string;
  Approved: boolean;
  Price_At_500_kwh: number;
  Price_At_1000_kwh: number;
  Price_At_2000_kwh: number;
  Feature_List: [ string ];
  Legal_Text_List: [ string ];
  Actual_Pricing: IPricingDefinition;
  Credit_Check_Required: boolean;
  Has_Partner: boolean;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}

