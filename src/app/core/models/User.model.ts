
export interface IUser {
  Token: string;
  Profile: IUserProfile;
  Account_permissions: IUserAccountPermission[];
  Id: string;
  Creation_Time: Date;
  Date_Created: Date;
  Date_Last_Modified: Date;
}
interface IUserProfile {
  Email_Address: string;
  Username: string;
}
export interface IUserAccountPermission {
  AccountType: string;
  AccountNumber: string;
}

export interface IUserSecurityQuestions {
  Id: number;
  Question: string;
}

export interface IUserSigningUp {
  Email_Address: string;
  Zip_Code: string;
  Billing_Account_Id: string;
  User_name: string;
  Password: string;
  Security_Question_Id: number;
  Security_Question_Answer: string;
}
