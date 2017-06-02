
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
  Contacts: [ ICustomerAccountContacts ];
}

@Injectable()
export class CustomerAccountService {

  private customerAccountUrl = 'api/Customer_Account';

  constructor(private http: Http) { }

  getCustomerAccounts(): Promise<CustomerAccount[]> {
    return Promise.resolve(MockData);
    /* For API:
     return this.http.get(this.customerAccountUrl)
     .toPromise()
     .then(response => response.json().data as CustomerAccount[])
     .catch(this.handleError);
     */
  }

  getCustomerAccount(id: string): Promise<CustomerAccount> {
    for (const index in MockData) {
      if (!MockData[index]) { continue; }
      if (MockData[index].id === id) { return Promise.resolve(MockData[index]); }
    }
    return Promise.reject(null);
    /* For API:
     return this.http.get(`${this.customerAccountUrl}/${id}`)
     .toPromise()
     .then(response => response.json().data as CustomerAccount)
     .catch(this.handleError);
     */
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
