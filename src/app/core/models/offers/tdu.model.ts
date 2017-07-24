
export interface ITDU {
  Name: string;
  Abbreviation: string;
  Duns_Number: string;
  Billing_System_Name: string;
  Rate_Code_Id: string;
  Priority_Move_In_Fee_Existing_Meter: number;
  Priority_Move_In_Fee_New_Meter: number;
  Standard_Move_In_Fee_Existing_Meter: number;
  Standard_Move_In_Fee_New_Meter: number;
  Self_Selected_Switch_Fee: number;
  Credit_Check_Required: boolean;
  Bill_Type: string;
  Meter_Charge: number;
  Delivery_Charge: number;
  Id: string;
  Creation_Time: string;
  Date_Created: string;
  Date_Last_Modified: string;
}
