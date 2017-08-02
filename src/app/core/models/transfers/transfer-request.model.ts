
import { IPhoneNumber } from '../address/phonenumber.model';
import { IAddress } from '../address/address.model';

export class TransferRequest {
    Email_Address: string;
    Service_Account_Id: string;
    Current_Service_End_Date: string;
    Final_Bill_To_Old_Service_Address?: boolean;
    Final_Bill_Address: IAddress;
    UAN: string;
    Service_Address?: IAddress;
    TDSP_Instructions?: string;
    New_Service_Start_Date: string;
    Keep_Current_Offer?: boolean;
    Offer_Id?: string;
    Contact_Info: ContactInfo;
    Language_Preference?: string;
    Promotion_Code_Used?: string;
    Channel_Id?: string;
    Referrer_Id?: string;
    Date_Sent: string;
}

export interface ContactInfo {
    Email_Address: string;
    Primary_Phone_Number: IPhoneNumber;
    Secondary_Phone_Number?: IPhoneNumber;
}
