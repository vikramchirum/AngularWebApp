import { IFees } from './fees.model';

export interface IAvailableDate  {
  Date_Called: string;
  UAN: string;
  Available_Move_In_Dates: [ string ];
  Available_Self_Selected_Switch_Dates: [ string ];
  Fees: [ IFees ];
}
