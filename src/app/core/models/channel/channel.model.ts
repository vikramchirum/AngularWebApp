export interface IChannel {
  Name: string;
  Description: string;
  Internal: boolean;
  Billing_Id: string;
  Client_Email_Addresses: [IClientEmailAddress];
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}

export interface IClientEmailAddress {
  Email_Address: string;
}
