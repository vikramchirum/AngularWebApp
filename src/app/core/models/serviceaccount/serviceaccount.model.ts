/**
 * Created by vikram.chirumamilla on 7/27/2017.
 */

import { assign } from 'lodash';

import { IAddress } from '../address/address.model';
import { IServiceAccountPlanHistoryOffer } from './serviceaccountplanhistoryoffer.model';

export class ServiceAccount {
  Customer_Account_Id: string;
  Id: string;
  Past_Due: number;
  Current_Due: number;
  Deposit_Balance: number;
  UAN: string;
  TDU_Name: string;
  TDU_DUNS_Number: string;
  Service_Address: IAddress;
  Mailing_Address: IAddress;
  Budget_Billing: boolean;
  Service_Stop_Request_date: string;
  Status_Id: number;
  Status: string;
  Terminate_Switch: boolean;
  Switch_Hold: boolean;
  Contract_Start_Date: string;
  Contract_End_Date: string;
  Last_payment_amount: number;
  Last_payment_date: string;
  Due_Amount: number;
  Due_Date: string;
  New_Charges: string;
  Enrolled_In_Auto_Bill_Pay: boolean;
  Is_Auto_Bill_Pay: boolean;
  AutoPayConfigId: number;
  PayMethodId: number;
  Is_Happiness_Guranteed: boolean;
  Latest_Invoice_Id: number;
  Average_Usage: number;
  Current_Offer: IServiceAccountPlanHistoryOffer;
  Offering_Name: string;
  Calculated_Contract_End_Date: Date;
  Tos_Fee_Id: string;

  constructor(opts: any) {
    assign(this, opts);
  }

  addressString(type: string): string {
    if (type === 'Service_Address'
        || type === 'Mailing_Address') {
       if (this.Status === 'Disconnected') {
         return [
           this[type].Line1,
           this[type].Line2 && this[type].Line2 !== '' ? ' ' + this[type].Line2 : '',
           ', ',
           this[type].City,
           ', ',
           this[type].State,
           ' ',
           this[type].Zip,
           this[type].Zip_4 && this[type].Zip_4 !== '' ? '-' + this[type].Zip_4 : '',
           ' ',
           '(Closed Account)'
         ].join('');
       } else {
        return [
          this[type].Line1,
          this[type].Line2 && this[type].Line2 !== '' ? ' ' + this[type].Line2 : '',
          ', ',
          this[type].City,
          ', ',
          this[type].State,
          ' ',
          this[type].Zip,
          this[type].Zip_4 && this[type].Zip_4 !== '' ? '-' + this[type].Zip_4 : ''
        ].join('');
      }

    }
    return null;
  }

  serviceAddressString(): string {
    return this.addressString('Service_Address');
  }

  mailingAddressString(): string {
    return this.addressString('Mailing_Address');
  }
}
