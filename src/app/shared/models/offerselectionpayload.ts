/**
 * Created by vikram.chirumamilla on 9/29/2017.
 */

import { OfferSelectionType } from 'app/core/models/enums/offerselectiontype';

export interface IOfferSelectionPayLoad {
  Service_Account_Id: string;
  Offering_Name: string;
  User_Name: string;
  Has_Partner: boolean;
  Partner_Name_On_Account: string;
  Partner_Account_Number: string;
  OfferSelectionType: OfferSelectionType;
}
