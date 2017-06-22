
export interface ICustomerAccountDriversLicense {
  Number: string;
  State: string;
}
export interface ICustomerAccountPrimaryPhone {
  Type: string;
  Area_Code: string;
  Number: string;
  Extension: string;
  Agree_To_Marketing: string;
}
export interface ICustomerAccountContacts {
  First_Name: string;
  Last_Name: string;
  Password: string;
}

export class CustomerAccountClass {
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
