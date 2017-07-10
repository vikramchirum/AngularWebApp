/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface ICreateRenewalRequest {
  billing_account_id: number;
  user_name: string;
  start_date: Date;
  offering_id: string;
}
