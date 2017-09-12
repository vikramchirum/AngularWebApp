/**
 * Created by vikram.chirumamilla on 9/8/2017.
 */

import { ICustomerAccountPrimaryPhone } from '../customeraccount/customeraccountprimaryphone.model';

export interface IContactUsRequest {
  Service_Account_Id: string;
  DaytimePhone: ICustomerAccountPrimaryPhone;
  Question: string;
}
