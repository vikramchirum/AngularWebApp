/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface ICreateRenewalRequest {
  Service_Account_Id: number;
  User_Name: string;
  Start_Date: Date;
  Offering_Id: string;
}
