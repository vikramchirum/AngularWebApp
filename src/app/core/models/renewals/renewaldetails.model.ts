import { IRenewal } from './renewal.model';
/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */

export interface IRenewalDetails {
  billing_account_id: number;
  billing_account_status: string;
  is_account_eligible_renewal: boolean;
  is_pending_renewal: boolean;
  is_moveout_scheduled: boolean;
  contract_enddate?: Date;
  tdu_duns_number: string;
  remaining_contractterm_in_days?: number;
  existing_renewal: IRenewal;
}
