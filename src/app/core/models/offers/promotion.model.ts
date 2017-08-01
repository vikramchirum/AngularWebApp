
import {IAttributes} from './attributes.model';
import {IIncentives} from './incentives.model';

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
