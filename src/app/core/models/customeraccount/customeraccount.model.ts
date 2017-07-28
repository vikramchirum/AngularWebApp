/**
 * Created by vikram.chirumamilla on 7/27/2017.
 */


import { assign } from 'lodash';

import {ICustomerAccountDriversLicense} from './customeraccountdriverslicense.model';
import {ICustomerAccountPrimaryPhone} from './customeraccountprimaryphone.model';
import {ICustomerAccountContacts} from './customeraccountcontacts.model';

export class CustomerAccount {
  Id: string;
  Date_Of_Birth: string;
  Email: string;
  Prefix: string;
  Suffix: string;
  First_Name: string;
  Middle_Name: string;
  Last_Name: string;
  Language: string;
  Drivers_License: ICustomerAccountDriversLicense;
  Social_Security_Number: string;
  Phone: string;
  Past_Due: number;
  Bad_Debt_Balance: number;
  Pledge_On_Entity: boolean;
  Primary_Phone: ICustomerAccountPrimaryPhone;
  Contacts: [ ICustomerAccountContacts ];

  constructor(opts: any) {
    assign(this, opts);
  }
}
