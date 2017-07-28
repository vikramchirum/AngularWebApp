
import {IProduct} from './product.model';
import {ITDU} from './tdu.model';
import {IPricingDefinition} from './pricingdefinition.model';
import {IFeaturedChannels} from './featuredchannels.model';
import {IIncentives} from './incentives.model';

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
