export interface IPartnerInfo {
  Partner: IPartner;
  Code: string;
}

export interface IPartner {
  Description: string;
  Billing_Code: string;
  Id: string;
  Creation_Time: string;
  Name: string;
  Date_Created: string;
  Date_Last_Modified: string;
}
