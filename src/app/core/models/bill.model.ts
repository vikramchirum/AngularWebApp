/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */

export interface IBill {
  Invoice_Id: number;
  Invoice_Date: Date;
  Due_Date: Date;
  Usage: number;
  Current_Charges: number;
  Amount_Due: number;
  Credit: number;
  Balance_Forward: number;
}
