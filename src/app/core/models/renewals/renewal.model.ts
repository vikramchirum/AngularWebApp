import {IOffers} from '../offers/offers.model';
/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IRenewal {
  Id: string;
  Service_Account_Id: string;
  User_Name: string;
  OfferingName: string;
  Offer: IOffers;
  Start_Date: Date;
  Execution_Date: Date;
  Is_Pending: boolean;
}

