/**
 * Created by vikram.chirumamilla on 7/28/2017.
 */

import {IPaymethodRequestEcheck} from './paymethodrequestecheck.model';
import {IPaymethodRequestCreditCard} from './paymethodrequestcreditcard.model';

export interface IPaymethodRequest {
  account_holder: string;
  CreditCard?: IPaymethodRequestCreditCard;
  Echeck?: IPaymethodRequestEcheck;
}
