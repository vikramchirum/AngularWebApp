export class TransferRequest {
    Billing_Account_Id: string;
    Current_Service_End_Date: string;
    Final_Bill_To_Old_Billing_Address?: boolean;
    Final_Bill_Address: Address;
    UAN: string;
    Billing_Address?: Address;
    TDSP_Instructions?: string;
    New_Service_Start_Date: string;
    Keep_Current_Offer?: boolean;
    Offer_Id?: string
    Contact_Info: ContactInfo;
    Language_Preference?: string;
    Promotion_Code_Used?: string;
    Channel_Id?: string;
    Referrer_Id?: string;
    Date_Sent: string;
}


export interface Address {
    Line1: string;
    Line2: string;
    City: string;
    State: string;
    Zip: string;
    Zip_4: string;
}


export interface ContactInfo {
    Email_Address: string;
    Primary_Phone_Number: PhoneNumber;
    Secondary_Phone_Number?: PhoneNumber;

}

export interface PhoneNumber {
    Type: string;
    Area_Code: string;
    Number: string;
    Extension: string;
    Agree_To_Marketing: string;
}