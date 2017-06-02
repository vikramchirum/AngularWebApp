
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import MockData from './BillingAccount.mock-data.json';

interface IBillingAccountAddress {
  Line1: string;
  Line2: string;
  City: string;
  State: string;
  Zip: string;
  Zip_4: string;
}
interface IBillingAccountPlanHistory {
  StartDate: string;
  StopDate: string;
  CSP_Status: string;
  Offer: [ IBillingAccountPlanHistoryOffer ];
  OfferingName: string;
}
interface IBillingAccountPlanHistoryOffer {
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
interface IBillingAccountPlanHistoryOfferCharge {
  Min: number;
  Max: number;
  Amount: number;
}

export class BillingAccount {
  Entity_id: string;
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
  Service_Stop_Request_date: string;
  Status_Id: number;
  Status: string;
  Terminate_Switch: boolean;
  Switch_Hold: boolean;
  Contract_Start_Date: string;
  Contract_End_Date: string;
  Last_payment_amount: number;
  Last_payment_date: string;
  Plan_History: [ IBillingAccountPlanHistory ];

  constructor(opts: any) {
    for (const key in opts) {
      if (opts[key] !== undefined) {
        this[key] = opts[key];
      }
    }
  }

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

  serviceAddressString(): string {
    return this.addressString('Service_Address');
  }

  mailingAddressString(): string {
    return this.addressString('Mailing_Address');
  }
}

@Injectable()
export class BillingAccountService {

  public BillingAccounts: BillingAccount[];
  private BillingAccountUrl = 'api/Billing_Account';

  constructor(
    private http: Http
  ) {
    this.BillingAccounts = null;
  }

  getBillingAccounts(): Promise<BillingAccount[]> {
    // If we have the Billing Accounts, return them:
    // To-do Maybe look them up again?
    if (this.BillingAccounts !== null) { return Promise.resolve(this.BillingAccounts); }
    // If we did not have them, look them up:
    return Promise.resolve(MockData)
      .then(data => this.processApiData(data))
      .catch(this.handleError);
    // return this.http.get(this.BillingAccountUrl)
    //   .toPromise()
    //   .then(response => response.json().data)
    //   .then(data => this.processApiData(data))
    //   .catch(this.handleError);
  }

  getBillingAccount(id: string): Promise<BillingAccount> {
    for (const index in MockData) {
      if (!MockData[index]) { continue; }
      if (MockData[index].id === id) { return Promise.resolve(MockData[index]); }
    }
    return Promise.reject(null);
    /* For API:
     return this.http.get(`${this.BillingAccountUrl}/${id}`)
     .toPromise()
     .then(response => response.json().data as BillingAccount)
     .catch(this.handleError);
     */
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private processApiData(data: BillingAccount[]) {
    this.BillingAccounts = [];
    for (var index in data) {
      if (data[index]) {
        this.BillingAccounts.push(new BillingAccount(data[index]));
      }
    }
    return this.BillingAccounts;
  }

}
