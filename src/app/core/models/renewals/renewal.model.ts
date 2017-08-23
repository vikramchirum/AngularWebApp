import {IOffers} from '../offers/offers.model';
/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IRenewal {
  id: number;
  Service_Account_Id: number;
  User_Name: string;
  OfferingName: string;
  Offer: IOffers;
  Start_Date: Date;
  Execution_Date: Date;
  Is_Pending: boolean;
}

