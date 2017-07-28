/**
 * Created by vikram.chirumamilla on 7/28/2017.
 */

export interface IPaymethodRequestEcheck {
  account_number: string;
  account_type: string;
  routing_number: string;
  other_info?: string;
}
