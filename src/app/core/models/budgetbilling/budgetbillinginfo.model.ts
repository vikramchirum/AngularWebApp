/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IBudgetBillingInfo {
  Billing_Account_Id: number;
  Indicator: boolean;
  Amount: number;
  Create_Date: Date;
  Variance: number;
  Pending_Cancel_Count: number;
  AverageKWH: number;
}
