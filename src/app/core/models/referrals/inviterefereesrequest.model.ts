/**
 * Created by vikram.chirumamilla on 9/7/2017.
 */

import { IRefereeRequest } from './refereerequest.model';

export interface IInviteRefereeRequest {
  Customer_Account_Id: string;
  FriendsList: IRefereeRequest[];
}
