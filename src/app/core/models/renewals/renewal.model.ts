import {Offer} from '../offers/offer.model';
/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IRenewal {
  Id: string;
  Service_Account_Id: string;
  User_Name: string;
  OfferingName: string;
  Offer: Offer;
  Start_Date: Date;
  Execution_Date: Date;
  Is_Pending: boolean;
  End_Date: Date;
}

