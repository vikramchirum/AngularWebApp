export class TransferService {
    Billing_Account_Id:string;
    Current_Service_End_Date:string;
    Final_Bill_To_Old_Billing_Address:boolean;
    Final_Bill_Address:FinalBillAddress;
    UAN:string;
    Billing_Address:BillingAddress;
    TDSP_Instructions:string;
    New_Service_Start_Date:string;
    Keep_Current_Offer:boolean;
    Offer_Id:string
    Contact_Info:ContactInfo;
    Language_Preference:string;
    Promotion_Code_Used:string;  
    Channel_Id: string;
    Referrer_Id: string;
    Date_Sent: string;
}

export interface FinalBillAddress {
Line1: string;
  Line2: string;
  City: string;
  State: string;
  Zip: string;
  Zip_4: string;
}

export interface BillingAddress {
  Line1: string;
  Line2: string;
  City: string;
  State: string;
  Zip: string;
  Zip_4: string;
}
export interface ContactInfo {
    Email_Address:string;
    Primary_Phone_Number:PrimaryPhoneNumber;
    Secondary_Phone_Number:SecondaryPhoneNumber;

}

export interface PrimaryPhoneNumber{
  Type: string;
  Area_Code: string;
  Number: string;
  Extension: string;
  Agree_To_Marketing: string;
}

export interface SecondaryPhoneNumber{
  Type: string;
  Area_Code: string;
  Number: string;
  Extension: string;
  Agree_To_Marketing: string;
}
   
 