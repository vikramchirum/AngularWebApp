/**
 * Created by vikram.chirumamilla on 7/6/2017.
 */

export interface IBudgetBillingEstimate {
  billing_account_id: number;
  totalKWH: number;
  totalmonths: number;
  averageKWH: number;
  amount: number;
  isbudgetbillingdefaultamount: number;
  variance: number;
  isvariancebillgenerated: boolean;
}
