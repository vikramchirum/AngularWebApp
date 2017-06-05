
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

@Injectable()
export class BillingAccountService {

  public BillingAccounts: BillingAccount[] = null;
  private CurrentBillingAccount: BillingAccount = null;
  private BillingAccountUrl = 'api/Billing_Account';

  constructor(
    private http: Http
  ) { }

  /**
   * Returns the current billing account and sets it if it is not already set.
   * @returns {BillingAccount}
   */
  getCurrentBillingAccount(): Promise<BillingAccount> {

    // Reset the current bill.
    this.CurrentBillingAccount = null;

    // Set the current bill, getting the bills if we haven't already.
    return this.getBillingAccounts()
      .then((Bills: BillingAccount[]) => this.CurrentBillingAccount = Bills[0])
      .catch(error => this.handleError(error))
      .then(() => this.CurrentBillingAccount);
  }

  /**
   * Returns the array of billing accounts and requests them if they have not been already requested.
   * @returns {Promise<BillingAccount[]>}
   */
  getBillingAccounts(): Promise<BillingAccount[]> {

    // If we have the Billing Accounts, return them:
    // To-do Maybe look them up again?
    if (this.BillingAccounts !== null) { return Promise.resolve(this.BillingAccounts); }

    // If we did not have them, look them up:
    return Promise.resolve(MockData)
      .then(data => this.processApiData(data))
      .catch(error => this.handleError(error));
    // return this.http.get(this.BillingAccountUrl)
    //   .toPromise()
    //   .then(response => response.json().data)
    //   .then(data => this.processApiData(data))
    //   .catch(error => this.handleError(error));

  }

  /**
   * Returns the identified billing account and requests it if it has not already been requested.
   * @param id
   * @returns {Promise<BillingAccount>}
   */
  getBillingAccount(Id: string): Promise<BillingAccount> {

    // If we have not gotten the billing accounts, get them and return the specified:
    if (this.BillingAccounts === null) {
      return this.getBillingAccounts()
        .then(() => this.getBillingAccount(Id));
    }

    // We have the billing accounts, so find the one with the matching Id and then return it:
    for (const index in this.BillingAccounts) {
      if (
        this.BillingAccounts[index]
        && this.BillingAccounts[index].Id === Id
      ) {
        return Promise.resolve(this.BillingAccounts[index]);
      }
    }

    // Otherwise no billing account was found, return null:
    return Promise.reject(null);

  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private processApiData(data: BillingAccount[]) {

    // Reset the current billing accounts:
    this.BillingAccounts = [];

    // Add new billing accounts applying the provided data:
    for (const index in data) {
      if (data[index]) {
        this.BillingAccounts.push(new BillingAccount(data[index]));
      }
    }

    // Return all of what we added:
    return this.BillingAccounts;

  }

}
