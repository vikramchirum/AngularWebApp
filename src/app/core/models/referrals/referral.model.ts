/**
 * Created by vikram.chirumamilla on 9/6/2017.
 */

import { IReferee } from './referee.model';

export class IReferral {
  Service_Account_Id: string;
  Customer_Account_Id: string;
  RefereeList: IReferee[];
}
