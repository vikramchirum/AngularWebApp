/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IRenewal {
  id: number;
  service_account_id: number;
  user_name: string;
  offeringname: string;
  start_date: Date;
  execution_date: Date;
  is_pending: boolean;
}
