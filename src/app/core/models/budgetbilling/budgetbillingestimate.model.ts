/**
 * Created by vikram.chirumamilla on 7/6/2017.
 */

export interface IBudgetBillingEstimate {
  Billing_Account_Id: number;
  TotalKWH: number;
  TotalMonths: number;
  AverageKWH?: number;
  Amount: number;
  IsBudgetBillingDefaultAmount: boolean;
  Variance: number;
  IsVarianceBillGenerated: boolean;
  Past_Due: number;
  Check_Past_Due: boolean;
}
