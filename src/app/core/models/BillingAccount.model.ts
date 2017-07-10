
export interface IBillingAccountAddress {
  Line1: string;
  Line2: string;
  City: string;
  State: string;
  Zip: string;
  Zip_4: string;
}
export interface IBillingAccountPlanHistory {
  StartDate: string;
  StopDate: string;
  CSP_Status: string;
  Offer: [ IBillingAccountPlanHistoryOffer ];
  OfferingName: string;
}
export interface IBillingAccountPlanHistoryOffer {
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
  Early_Termination_Fee: number;
  Base_Charge: number;
  Energy_Charges: [ IBillingAccountPlanHistoryOfferCharge ];
  Usage_Credits: [ IBillingAccountPlanHistoryOfferCharge ];
  Usage_Charges: [ IBillingAccountPlanHistoryOfferCharge ];
  Start_Date: string;
  End_Date: string;
}
export interface IBillingAccountPlanHistoryOfferCharge {
  Min: number;
  Max: number;
  Amount: number;
}

export class BillingAccountClass {
  Customer_Account_Id: string;
  Id: string;
  Past_Due: number;
  Current_Due: number;
  UAN: string;
  TDU_Name: string;
  TDU_DUNS_Number: string;
  Service_Address: IBillingAccountAddress;
  Mailing_Address: IBillingAccountAddress;
  Paperless_Billing: boolean;
  Budget_Billing: boolean;
  Is_Auto_Bill_Pay: boolean;
  PayMethodId: number;
  Service_Stop_Request_date: string;
  Status_Id: number;
  Status: string;
  Terminate_Switch: boolean;
  Switch_Hold: boolean;
  Contract_Start_Date: string;
  Contract_End_Date: string;
  Latest_Invoice_Id: string;
  Last_payment_amount: number;
  Last_payment_date: string;
  Plan_History: [ IBillingAccountPlanHistory ];

  /**
   * Construct a new Billing_Account passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    for (const key in opts) {
      if (opts[key] !== undefined) {
        this[key] = opts[key];
      }
    }
  }

  /**
   * Returns back a formatted string of either the 'Service_Address' or 'Mailing_Address'.
   * @param type
   * @returns {string | null}
   */
  addressString(type: string): string {

    if (
      type === 'Service_Address'
      || type === 'Mailing_Address'
    ) {
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

    return null;

  }

  /**
   * Returns back the formatted string of the 'Service_Address'.
   * @returns {string}
   */
  serviceAddressString(): string {
    return this.addressString('Service_Address');
  }

  /**
   * Returns back the formatted string of the 'Mailing_Address'.
   * @returns {string}
   */
  mailingAddressString(): string {
    return this.addressString('Mailing_Address');
  }

}
