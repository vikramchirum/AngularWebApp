
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import MockData from './CustomerAccount.mock-data.json';

interface ICustomerAccountDriversLicense {
  Number: string;
  State: string;
}
interface ICustomerAccountContacts {
  First_Name: string;
  Last_Name: string;
  Password: string;
}

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
  Enrolled_In_My_Rewards_And_Referrals: boolean;
  Contacts: [ ICustomerAccountContacts ];

  /**
   * Construct a new Customer_Account passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    for (const key in opts) {
      if (opts[key] !== undefined) {
        this[key] = opts[key];
      }
    }
  }

}

@Injectable()
export class CustomerAccountService {

  public CustomerAccounts: CustomerAccount[] = null;
  private CurrentCustomerAccount: CustomerAccount = null;
  private customerAccountUrl = 'api/customer_accounts';

  constructor(
    private Http: Http
  ) { }

  /**
   * Returns the current customer account and sets it if it is not already set.
   * @returns {CustomerAccount}
   */
  getCurrentCustomerAccount(): Promise<CustomerAccount> {

    // Reset the customer account.
    this.CurrentCustomerAccount = null;

    // Set the customer account, getting the accounts if we haven't already.
    return this.getCustomerAccounts()
      .then((Accounts: CustomerAccount[]) => this.CurrentCustomerAccount = Accounts[0])
      .catch(error => this.handleError(error))
      .then(() => this.CurrentCustomerAccount);
  }

  /**
   * Returns the array of Accounting accounts and requests them if they have not been already requested.
   * @returns {Promise<CustomerAccount[]>}
   */
  getCustomerAccounts(): Promise<CustomerAccount[]> {

    // If we have the customer accounts, return them:
    // To-do Maybe look them up again?
    if (this.CustomerAccounts !== null) { return Promise.resolve(this.CustomerAccounts); }

    // If we did not have them, look them up:
    return Promise.resolve(MockData)
      .then(data => this.processApiData(data))
      .catch(error => this.handleError(error));
    // return this.http.get(this.CustomerAccountUrl)
    //   .toPromise()
    //   .then(response => response.json().data)
    //   .then(data => this.processApiData(data))
    //   .catch(error => this.handleError(error));

  }

  /**
   * Returns the identified customer account and requests it if it has not already been requested.
   * @param id
   * @returns {Promise<CustomerAccount>}
   */
  getCustomerAccount(Id: string): Promise<CustomerAccount> {

    // If we have not gotten the Accounting accounts, get them and return the specified:
    if (this.CustomerAccounts === null) {
      return this.getCustomerAccounts()
        .then(() => this.getCustomerAccount(Id));
    }

    // We have the customer accounts, so find the one with the matching Id and then return it:
    for (const index in this.CustomerAccounts) {
      if (
        this.CustomerAccounts[index]
        && this.CustomerAccounts[index].Id === Id
      ) {
        return Promise.resolve(this.CustomerAccounts[index]);
      }
    }

    // Otherwise no customer account was found, return null:
    return Promise.reject(null);

  }

  /**
   * Get the current customer account and update it's "Enrolled_In_My_Rewards_And_Referrals" to true.
   * @returns {Promise<CustomerAccount>}
   */
  enrollMyRewardsAndReferrals(): Promise<CustomerAccount> {
    return this.getCurrentCustomerAccount()
      .then(() => {
        this.CurrentCustomerAccount.Enrolled_In_My_Rewards_And_Referrals = true;
        return this.CurrentCustomerAccount
      });
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private processApiData(data: CustomerAccount[]) {

    // Reset the customer accounts:
    this.CustomerAccounts = [];

    // Add new customer accounts applying the provided data:
    for (const index in data) {
      if (data[index]) {
        this.CustomerAccounts.push(new CustomerAccount(data[index]));
      }
    }

    // Return all of what we added:
    return this.CustomerAccounts;

  }

}
