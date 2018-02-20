/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface ICreateRenewalRequest {
  Service_Account_Id: string;
  User_Name: string;
  Offering_Id: string;
  Partner_Account_Number: string;
  Partner_Name_On_Account: string;
  Channel_Id: string;
  Current_Rate_Code: string;
}
