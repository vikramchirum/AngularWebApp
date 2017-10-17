import {IMeterActionDate} from "./meterActionDate.model";
import {ITduActionPrice} from "./tduActionPrice.model";

export interface ITduAvailabilityResult  {
  Date_Called: string;
  UAN: string;
  Dates: [ IMeterActionDate ];
  Prices: [ ITduActionPrice];
}
