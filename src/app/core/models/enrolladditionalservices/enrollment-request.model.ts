import { IPhoneNumber } from '../address/phonenumber.model';
import { IAddress } from '../address/address.model';
import { ICustomerAccountPrimaryPhone } from '../customeraccount/customeraccountprimaryphone.model';

export class EnrollmentRequest {
    Email_Address?: string;
   Offer_Id: string;
   Promotion_Code_Used?: string;
    Referrer_Id?: string;
    UAN: string;
    Customer_Check_Token: string;
    Deposit_Record?: DepositRecord;
    Waiver: string;
    Service_Type: string;
    Selected_Start_Date: string;
    Language_Preference: string;
    Contact_Info: ContactInfo;
    Billing_Address: IAddress;
    TDSP_Instructions?: string;
    Aware_Of_TDU_Fees?: boolean;
    Agrees_To_Priority_Move_In_Charge?: boolean;
    Partner_Account_Number?: string;
    Partner_Name_On_Account?: string;
    Date_Sent?: string;
    Channel_Id?: string;
}
export interface ContactInfo {
    Email_Address?: string;
    Primary_Phone_Number?: ICustomerAccountPrimaryPhone;
    Secondary_Phone_Number?: ICustomerAccountPrimaryPhone;
}

export interface DepositRecord {
    Transaction_Id: string;
    Amount: number;
    First_Name: string;
    Last_Name: string;
    Paid_On: string;
}
