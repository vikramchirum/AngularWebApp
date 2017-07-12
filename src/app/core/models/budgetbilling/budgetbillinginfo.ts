/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IBudgetBillingInfo {
  billing_account_id: number;
  indicator: boolean;
  amount: number;
  create_date: Date;
  variance: number;
  pending_cancel_count: number;
  averageKWH: number;
}
