import { IAddress, addressString } from './address/address';
import {assign} from 'lodash';
 
export class OrderStatus {
    Billing_Account_Id: string;
    Offer: Offer;
    Service_Account_Address: IAddress;
    Prev_Service_Account_Address: IAddress;
    Order_Placed: String;
    Order_Type: String;
    Status: String;

    /**
   * Construct a new Order Status passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);
  }


  /**
   * Returns back the formatted string of the 'Service_Address'.
   * @returns {string}
   */
  prevServiceAccountAddressString(): string {
    return addressString(this.Prev_Service_Account_Address);
  };

  serviceAccountAddressString(): string {
    return addressString(this.Service_Account_Address);
  };

 
}

export interface Offer {
    Rate_Code: string;
    Client_Key: string;
    Promotion_Name: string;
    Promotion_Code: string;
    Product_Name: string;
    Product_Description: string;
    RateAt500kwh: number;
    RateAt1000kwh: number;
    RateAt2000kwh: number;
    Term: number;
    TDU_Name: string;
    TDU_DUNS_Number: string;
    Meter_Charge: number;
    Delivery_Charge: number;
    Family: String;
    Family_String: string;
    Early_Termination_Fee: number;
    Base_Charge: number;
    Energy_Charges: [OfferCharge];
    Usage_Credits: [OfferCharge];
    Usage_Charges: [OfferCharge];
    Start_Date: string;
    End_Date: string
}

export interface OfferCharge {
    Min: number;
    Max: number;
    Amount: number;
}


 